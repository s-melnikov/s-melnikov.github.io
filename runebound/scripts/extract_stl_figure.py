#!/usr/bin/env python3
"""Extract one or all standees from a binary STL sheet."""

from __future__ import annotations

import argparse
import struct
from dataclasses import dataclass
from pathlib import Path


TRIANGLE_SIZE = 50


@dataclass(frozen=True)
class Bounds:
    minimum: tuple[float, float, float]
    maximum: tuple[float, float, float]


def read_binary_stl(path: Path) -> tuple[bytes, list[bytes]]:
    data = path.read_bytes()
    if len(data) < 84:
        raise ValueError(f"{path} is too small to be a binary STL")
    count = struct.unpack_from("<I", data, 80)[0]
    if len(data) != 84 + count * TRIANGLE_SIZE:
        raise ValueError(f"{path} is not a supported binary STL")
    triangles = [
        data[84 + index * TRIANGLE_SIZE : 84 + (index + 1) * TRIANGLE_SIZE]
        for index in range(count)
    ]
    return data[:80], triangles


def triangle_vertices(triangle: bytes) -> tuple[tuple[float, float, float], ...]:
    values = struct.unpack_from("<12fH", triangle)
    return (values[3:6], values[6:9], values[9:12])


def bounds_for(triangles: list[bytes]) -> Bounds:
    minimum = [float("inf")] * 3
    maximum = [float("-inf")] * 3
    for triangle in triangles:
        for vertex in triangle_vertices(triangle):
            for axis, value in enumerate(vertex):
                minimum[axis] = min(minimum[axis], value)
                maximum[axis] = max(maximum[axis], value)
    return Bounds(tuple(minimum), tuple(maximum))


def connected_components(triangles: list[bytes]) -> list[list[bytes]]:
    parents = list(range(len(triangles)))
    sizes = [1] * len(triangles)
    vertex_owner: dict[bytes, int] = {}

    def find(index: int) -> int:
        while parents[index] != index:
            parents[index] = parents[parents[index]]
            index = parents[index]
        return index

    def union(left: int, right: int) -> None:
        left_root = find(left)
        right_root = find(right)
        if left_root == right_root:
            return
        if sizes[left_root] < sizes[right_root]:
            left_root, right_root = right_root, left_root
        parents[right_root] = left_root
        sizes[left_root] += sizes[right_root]

    for triangle_index, triangle in enumerate(triangles):
        for vertex in triangle_vertices(triangle):
            key = struct.pack("<3f", *vertex)
            owner = vertex_owner.setdefault(key, triangle_index)
            union(triangle_index, owner)

    grouped: dict[int, list[bytes]] = {}
    for index, triangle in enumerate(triangles):
        grouped.setdefault(find(index), []).append(triangle)
    return list(grouped.values())


def overlap(first_min: float, first_max: float, second_min: float, second_max: float) -> float:
    return max(0.0, min(first_max, second_max) - max(first_min, second_min))


def select_component(components: list[list[bytes]], base_bounds: Bounds) -> list[bytes]:
    def score(component: list[bytes]) -> float:
        bounds = bounds_for(component)
        overlap_x = overlap(
            bounds.minimum[0], bounds.maximum[0], base_bounds.minimum[0], base_bounds.maximum[0]
        )
        overlap_y = overlap(
            bounds.minimum[1], bounds.maximum[1], base_bounds.minimum[1], base_bounds.maximum[1]
        )
        vertical_gap = abs(bounds.minimum[2] - base_bounds.maximum[2])
        return overlap_x * overlap_y - vertical_gap * 10

    return max(components, key=score)


def arrange_components(components: list[list[bytes]]) -> list[list[list[bytes]]]:
    """Return the Rhino sheet as three top-to-bottom rows, each left-to-right."""
    if len(components) != 12:
        raise ValueError(f"Expected 12 figure components, found {len(components)}")

    def center_on_axis(component: list[bytes], axis: int) -> float:
        bounds = bounds_for(component)
        return (bounds.minimum[axis] + bounds.maximum[axis]) / 2

    by_row = sorted(
        components,
        key=lambda component: center_on_axis(component, 2),
        reverse=True,
    )
    rows = [by_row[index : index + 4] for index in range(0, 12, 4)]
    for row in rows:
        row.sort(key=lambda component: center_on_axis(component, 0))
    return rows


def write_binary_stl(path: Path, triangles: list[bytes]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    header = b"Runebound browser figure generated from local STL sources"[:80].ljust(80, b" ")
    path.write_bytes(header + struct.pack("<I", len(triangles)) + b"".join(triangles))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("models", type=Path)
    parser.add_argument("base", type=Path)
    parser.add_argument("figure_output", type=Path, nargs="?")
    parser.add_argument("base_output", type=Path, nargs="?")
    parser.add_argument("--all-output-dir", type=Path)
    args = parser.parse_args()

    _, model_triangles = read_binary_stl(args.models)
    _, base_triangles = read_binary_stl(args.base)
    components = connected_components(model_triangles)

    if args.all_output_dir:
        for row_index, row in enumerate(arrange_components(components), start=1):
            for column_index, component in enumerate(row, start=1):
                output = args.all_output_dir / f"hero-{row_index}-{column_index}.stl"
                write_binary_stl(output, component)
                print(f"Wrote {output}: {len(component)} figure triangles")
        base_output = args.all_output_dir / "hero-base.stl"
        write_binary_stl(base_output, base_triangles)
        print(f"Wrote {base_output}: {len(base_triangles)} base triangles")
        return

    if not args.figure_output or not args.base_output:
        parser.error(
            "figure_output and base_output are required unless --all-output-dir is used"
        )
    selected = select_component(components, bounds_for(base_triangles))
    write_binary_stl(args.figure_output, selected)
    write_binary_stl(args.base_output, base_triangles)
    print(
        f"Wrote {args.figure_output}: {len(selected)} figure triangles; "
        f"{args.base_output}: {len(base_triangles)} base triangles"
    )


if __name__ == "__main__":
    main()
