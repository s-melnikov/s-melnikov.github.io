# Keys

Every time your application is rendered, a virtual node tree is created from scratch.

Keys help identify which nodes were added, changed or removed from the new/old tree.

Use keys to tell the render algorithm to re-order the children instead of mutating them.

```jsx
<ul>
  {urls.map((url, id) => (
    <li key={id}>
      <img src={url} />
    </li>
  ))}
</ul>
```

Use keys also to force an element to be created only once.

```jsx
<ul>
  <li key="hyper">Hyper</li>
  <li>Super</li>
  <li>Ultra</li>
</ul>
```

If new elements are added to the list, the position of the keyed element will change.

Using a key in this way, we make sure <samp>hyper</samp> is always inserted at the right position instead of mutating its siblings for the same result.
