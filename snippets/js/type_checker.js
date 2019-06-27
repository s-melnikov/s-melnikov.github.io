let t = o => Object.prototype.toString.call(o).slice(8, -1)
console.log(
  t(undefined),
  t(null),
  t(true),
  t(0),
  t(NaN),
  t(""),
  t(Symbol()),
  t({}),
  t([]),
  t(()=>{}),
  t(function(){}),
)
