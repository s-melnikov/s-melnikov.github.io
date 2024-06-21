const ButlerColorPalette = {
  primary: {
    main: "#386DF4",
    light: "#5081FF",
    dark: "#264CAD"
  },
  secondary: {
    main: "#491FE0",
    light: "#6138F4",
    dark: "#1E008A"
  },
  error: {
    main: "#FF5630",
    light: "rgb(250, 113, 82, 0.40)",
    dark: "#ED350C"
  },
  warning: {
    main: "#FFAB00",
    light: "rgb(254, 195, 74, 0.40)",
    dark: "#AB7D22"
  },
  info: {
    main: "#386DF4",
    light: "rgba(56, 109, 244, 0.40);",
    dark: "#264CAD"
  },
  success: {
    main: "#36B37E",
    light: "rgb(68, 224, 158, 0.40)",
    dark: "#2B8D64"
  },
  common: {
    black: "#0A0E17",
    white: "#FFFFFF",
    divider: "rgba(0, 0, 0, 0.12)"
  },
  text: {
    primary: "#0A0E17",
    secondary: "#424550",
    disabled: "#A2A5AE",
    hint: "rgba(0, 0, 0, 38%)"
  },
  background: {
    default: "#F5F6F8",
    secondary: "#C2D3FF33",
    dark: "#282A36",
    light: "#F6FAFC"
  },
  icon: {
    default: "#C2D3FF"
  },
  brand: {
    main: "#386DF4",
    teal: "#00B8D9"
  }
};

let counter = 0;

const styleElement = document.createElement("style");

const divElement = document.createElement("div");

document.head.appendChild(styleElement);

const theme = {
  // eslint-disable-next-line no-magic-numbers
  spacing: (count) => `${count * 8}px`,
  palette: ButlerColorPalette,
  shape: {
    borderRadius: "4px"
  }
};

const REGEX = /^[A-Z]/;

const capital = (str) => REGEX.test(str);

const generate = (obj, prefix) => {
  return Object.entries(obj).reduce((res, [key, val]) => {
    if (typeof val === "object") {
      const className = key.replace(/^&\.?/g, "");

      if (!className.startsWith(":")) {
        const trimmed = className.trim();

        const uniqClassName = `${className.trim()}-${prefix}`;

        res[className] = uniqClassName;

        Object.entries(val).filter(([, value]) => typeof value !== "object").forEach(([name, value]) => {
          divElement.style[name] = value;
        });

        const rule = `${capital(uniqClassName)
          ? `.${uniqClassName[0].toLowerCase() + uniqClassName.slice(1)}`
          : uniqClassName} {${divElement.style.cssText}}`;

        // eslint-disable-next-line no-console
        console.log(">>>", `${capital(trimmed)
          ? `.${trimmed[0].toLowerCase() + trimmed.slice(1)}`
          : trimmed} {${divElement.style.cssText}}`);

        styleElement.sheet.insertRule(rule, styleElement.sheet.cssRules.length);

        divElement.style.cssText = "";
      }

      return { ...res, ...(generate(val, prefix)) };
    }

    return res;
  }, {});
};

const makeStyles = (fn) => {
  const styles = fn(theme);

  const classes = generate(styles, `x${(counter++).toString("36")}`);

  return () => {
    return classes;
  };
};

export default makeStyles;
