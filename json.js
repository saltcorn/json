const {
  textarea,
  text,
  table,
  th,
  tr,
  td,
  code,
  pre,
  input,
} = require("@saltcorn/markup/tags");

const json = {
  name: "JSON",
  sql_name: "jsonb",
  fieldviews: {
    show: {
      isEdit: false,
      run: (v) => pre({ class: "wsprewrap" }, code(JSON.stringify(v))),
    },
    pretty: {
      isEdit: false,
      run: (v) => pre({ class: "wsprewrap" }, code(JSON.stringify(v, null, 2))),
    },
    show_table: {
      isEdit: false,
      run: (v) => {
        console.log({ v });
        return typeof v !== "object" || !v
          ? ""
          : table(
              { class: "table table-sm" },
              Object.entries(v).map(([k, v]) => tr(th(k), td(v)))
            );
      },
    },
    edit: {
      isEdit: true,
      run: (nm, v, attrs, cls) =>
        textarea(
          {
            class: ["form-control", cls],
            name: text(nm),
            id: `input${text(nm)}`,
            rows: 10,
          },
          text(JSON.stringify(v)) || ""
        ),
    },
    edit_table: {
      isEdit: true,
      run: (nm, v, attrs, cls) =>
        textarea(
          {
            class: "d-none",
            name: text(nm),
            id: `input${text(nm)}`,
          },
          text(JSON.stringify(v)) || ""
        ) +
        table(
          {
            class: "table table-sm json-table-edit",
            id: `table-edit-${text(nm)}`,
          },
          Object.entries(v || {}).map(([k, v]) =>
            tr(
              td(
                input({
                  type: "text",
                  onChange: `jsonTableEdit('${text(nm)}')`,
                  value: k,
                })
              ),
              td(
                input({
                  type: "text",
                  onChange: `jsonTableEdit('${text(nm)}')`,
                  value: v,
                })
              )
            )
          )
        ),
    },
  },
  read: (v) => {
    switch (typeof v) {
      case "string":
        try {
          return JSON.parse(v);
        } catch {
          return undefined;
        }
      default:
        return v;
    }
  },
};

module.exports = { sc_plugin_api_version: 1, types: [json] };
