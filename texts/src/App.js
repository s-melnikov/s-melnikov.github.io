import Css from "./App.module.scss";

import { Fragment, useCallback, useState } from "react";

const downloadFile = ({ blob, filename }) => {
  const urlBlob = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = urlBlob;
  a.download = filename;
  a.click();
};

function App() {
  const [state, setState] = useState({});

  const { source, target, changes } = state;

  const [onlyUntranslated, setOnlyUntranslated] = useState(true);

  const handleFileInputChange = useCallback((event) => {
    const [file] = event.target.files;

    const fr = new FileReader();

    fr.addEventListener("load", (event) => {
      setState((prev) => {
        const parsed = JSON.parse(event.target.result);
        if (prev.source) {
          const [langCode] = file.name.split(".");
          return {
            ...prev,
            target: parsed,
            changes: parsed,
            langCode
          }
        }
        return { source: parsed };
      });
    });

    fr.readAsText(file);
  }, []);

  const handleTextAreaChange = useCallback(({ target }) => {
    const { value, dataset: { section, key } } = target;
    setState((prev) => ({
      ...prev,
      changes: {
        ...prev.changes,
        [section]: {
          ...prev.changes[section],
          [key]: value
        }
      }
    }));
  }, []);

  const handleCheckboxChange = useCallback(() => {
    setOnlyUntranslated((prev) => !prev);
  }, []);

  const handleDownloadClick = useCallback((event) => {
    const blob = new Blob([JSON.stringify(changes, null, 2)], { type: "application/json" });
    downloadFile({ blob, filename: `${state.langCode}.json` });
  }, [state.langCode, changes]);

  if (!source || !target) {
    return (
      <div className={Css.start}>
        <div>
          <div className={Css.desc}>{`Select ${source ? "second" : "first"} file`}</div>
          <input key={source ? 1 : 0} type="file" onChange={handleFileInputChange} />
        </div>
      </div>
    );
  }

  const sections = Object.keys(source);

  return (
    <div className={Css.editor}>
      <div className={Css.header}>
        <input type="checkbox" checked={onlyUntranslated} onChange={handleCheckboxChange} /> Only untranslated
        <button onClick={handleDownloadClick}>Download</button>
      </div>
      <table>
        <tbody>
          {sections.filter((section) => section !== "introScenarios").map((section) => {
            const keys = Object.keys(source[section]).filter((key) => !onlyUntranslated || !target[section][key]);

            if (!keys.length) return null;

            return (
              <Fragment key={section}>
                <tr>
                  <td colSpan={3}><div className={Css.title}>{section}</div></td>
                </tr>
                {keys.map((key) => {
                  return (
                    <tr key={key}>
                      <td><div className={Css.key}>{key}</div></td>
                      <td><div className={Css.source}>{source[section][key]}</div></td>
                      <td><div className={Css.translate}>
                        <textarea
                          data-section={section}
                          data-key={key}
                          onChange={handleTextAreaChange}>
                          {changes[section][key]}
                        </textarea>
                      </div></td>
                    </tr>
                  );
                })}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  )
}

export default App;
