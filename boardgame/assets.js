const ASSETS = [
  {
    name: "MainBoard",
    src: "MainBoard.webp",
    width: 1860,
    height: 1222,
    slots: [
      { id: 'GatesSupply', x: 64, y: -120, margin: 20 }
    ],
  },
  {
    name: 'GateCards',
    range: [1, 8],
    width: 127,
    height: 198,
    borderRadius: 6
  },




  {
    name: "PlayerBoard",
    src: "PlayerBoardFlat.webp",
    slots: [
      { id: "GuardTiles", x: 58, y: 109 },
      { id: "LabourerTiles", x: 58, y: 275 },
      { id: "FarmerTiles", x: 215, y: 57 },
      { id: "TraderTiles", x: 362, y: 57 },
      { id: "ElderTiles", x: 504, y: 57 },
      { id: "Card1", x: 0, y: 0 },
      { id: "Card2", x: 0, y: 0 },
      { id: "Card3", x: 0, y: 0 },
    ],
    width: 567,
    height: 620,
  },
  {
    name: "ElderTiles",
    range: [1, 8],
    width: 86,
    height: 177,
    borderRadius: 6
  },
  {
    name: "TraderTiles",
    range: [1, 5],
    width: 86,
    height: 177,
    borderRadius: 6
  },
  {
    name: "FarmerTiles",
    range: [1, 8],
    width: 98,
    height: 177,
    borderRadius: 6
  },
  {
    name: "GuardTiles",
    range: [1, 5],
    width: 176,
    height: 180,
    borderRadius: 6
  },
  {
    name: "LabourerTiles",
    range: [1, 5],
    width: 176,
    height: 113,
    borderRadius: 6
  }
];
