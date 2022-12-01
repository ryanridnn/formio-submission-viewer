/**
 * This file shows how to create a custom component.
 *
 * Get the base component class by referencing Formio.Components.components map.
 */
import React from "react";
import ReactDOM from "react-dom";
import { ReactComponent } from "@formio/react";
import editForm from "./SubmissionField.settingForm";
import Field from "./SubmissionField";

export default class SubmissionField extends ReactComponent {
  /**
   * This function tells the form builder about your component. It's name, icon and what group it should be in.
   */

  constructor(component, options, data) {
    super(component, options, data);
    setTimeout(() => {
      this.component.fieldValue = data[component.key] || this.data[component.key] || this.component.fieldValue
      this.triggerRedraw()
    }, 200)
  }

  static get builderInfo() {
    return {
      title: "Submission Field",
      icon: "sliders",
      documentation: "",
      group: 'basic',
      weight: -10,
      schema: SubmissionField.schema(),
    };
  }

  /**
   * This function is the default settings for the component. At a minimum you want to set the type to the registered
   * type of your component (i.e. when you call Components.setComponent('type', MyComponent) these types should match.
   */
  static schema() {
    return ReactComponent.schema({
      type: "submissionField",
      label: "Label",
      fieldValue: "Value",
      hideLabel: true,
      input: false
    });
  }

  /*
   * Defines the settingsForm when editing a component in the builder.
   */
  static editForm = editForm;

  /**
   * This function is called when the DIV has been rendered and added to the DOM. You can now instantiate the react component.
   *
   * #returns ReactInstance
   */

  attachReact(element, setReactInstance) {
    const reactInstance = ReactDOM.render(
      <Field
        component={this.component}
        value={this.dataValue}
        data={this.data}
      />,
      element
    );

    setReactInstance(reactInstance);
    return element;
  }

  /**
   * Automatically detach any react components.
   *
   * @param element
   */
  detachReact(element) {
    if (element) {
      ReactDOM.unmountComponentAtNode(element);
    }
  }
}