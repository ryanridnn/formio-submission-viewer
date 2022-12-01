import baseEditForm from "formiojs/components/_classes/component/Component.form";

export default function (...extend) {
  const editForm = baseEditForm(
    [
      {
        key: "display",
        components: [
          {
            key: "labelPosition",
            ignore: true,
          },
          {
            key: "placeholder",
            ignore: true,
          },
          {
            key: "description",
            ignore: true,
          },
          {
            key: "autofocus",
            ignore: true,
          },
          {
            key: "tooltip",
            ignore: true,
          },
          {
            key: "tabindex",
            ignore: true,
          },
          {
            key: "tableView",
            ignore: true,
          },
          {
            key: "modalEdit",
            ignore: false,
          },
          {
            input: true,
            key: "fieldValue",
            label: "Field Value",
            placeholder: "Field Value",
            tooltip: "The Default Value will be the value for this field, before user interaction. Having a default value will override the placeholder text.",
            type: "textfield",
            weight: 5
          }
        ],
      },
      {
        key: "addons",
        ignore: true,
      },
    ],
    ...extend
  );

  return editForm;
}