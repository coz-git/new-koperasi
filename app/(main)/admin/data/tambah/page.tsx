"use client";
import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { Calendar } from "primereact/calendar";
import { Chips } from "primereact/chips";
import { Slider } from "primereact/slider";
import { Knob } from "primereact/knob";
import { Rating } from "primereact/rating";
import { ColorPicker } from "primereact/colorpicker";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { InputSwitch } from "primereact/inputswitch";
import { ListBox } from "primereact/listbox";
import { Dropdown } from "primereact/dropdown";
import { ToggleButton } from "primereact/togglebutton";
import { MultiSelect } from "primereact/multiselect";
import { TreeSelect, TreeSelectSelectionKeysType } from "primereact/treeselect";
import { SelectButton } from "primereact/selectbutton";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { CountryService } from "../../../../../demo/service/CountryService";
import { NodeService } from "../../../../../demo/service/NodeService";
import { Demo } from "../../../../../types/types";
import { TreeNode } from "primereact/treenode";

interface InputValue {
  name: string;
  code: string;
}

const InputDemo = () => {
  const [floatValue, setFloatValue] = useState("");
  const [autoValue, setAutoValue] = useState<Demo.Country[]>([]);
  const [selectedAutoValue, setSelectedAutoValue] = useState(null);
  const [autoFilteredValue, setAutoFilteredValue] = useState<Demo.Country[]>(
    []
  );
  const [calendarValue, setCalendarValue] = useState(new Date());
  const [inputNumberValue, setInputNumberValue] = useState<number | null>(null);
  const [chipsValue, setChipsValue] = useState<any[]>([]);
  const [sliderValue, setSliderValue] = useState<number | string>(50);
  const [ratingValue, setRatingValue] = useState<number | undefined>(undefined);
  const [colorValue, setColorValue] = useState("1976D2");
  const [knobValue, setKnobValue] = useState(20);
  const [radioValue, setRadioValue] = useState(null);
  const [checkboxValue, setCheckboxValue] = useState<string[]>([]);
  const [switchValue, setSwitchValue] = useState(false);
  const [listboxValue, setListboxValue] = useState(null);
  const [dropdownValue, setDropdownValue] = useState(null);
  const [multiselectValue, setMultiselectValue] = useState(null);
  const [toggleValue, setToggleValue] = useState(false);
  const [selectButtonValue1, setSelectButtonValue1] = useState(null);
  const [selectButtonValue2, setSelectButtonValue2] = useState(null);
  const [inputGroupValue, setInputGroupValue] = useState(false);
  const [selectedNode, setSelectedNode] =
    useState<TreeSelectSelectionKeysType | null>(null);
  const [treeSelectNodes, setTreeSelectNodes] = useState<TreeNode[]>([]);

  const listboxValues: InputValue[] = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

  const dropdownValues: InputValue[] = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

  const multiselectValues: InputValue[] = [
    { name: "Australia", code: "AU" },
    { name: "Brazil", code: "BR" },
    { name: "China", code: "CN" },
    { name: "Egypt", code: "EG" },
    { name: "France", code: "FR" },
    { name: "Germany", code: "DE" },
    { name: "India", code: "IN" },
    { name: "Japan", code: "JP" },
    { name: "Spain", code: "ES" },
    { name: "United States", code: "US" },
  ];

  const selectButtonValues1: InputValue[] = [
    { name: "Option 1", code: "O1" },
    { name: "Option 2", code: "O2" },
    { name: "Option 3", code: "O3" },
  ];

  const selectButtonValues2 = [
    { name: "Option 1", code: "O1" },
    { name: "Option 2", code: "O2" },
    { name: "Option 3", code: "O3" },
  ];

  useEffect(() => {
    CountryService.getCountries().then((data) => setAutoValue(data));
    NodeService.getTreeNodes().then((data) => setTreeSelectNodes(data));
  }, []);

  const searchCountry = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      if (!event.query.trim().length) {
        setAutoFilteredValue([...autoValue]);
      } else {
        setAutoFilteredValue(
          autoValue.filter((country) => {
            return country.name
              .toLowerCase()
              .startsWith(event.query.toLowerCase());
          })
        );
      }
    }, 250);
  };

  const onCheckboxChange = (e: CheckboxChangeEvent) => {
    let selectedValue = [...checkboxValue];
    if (e.checked) selectedValue.push(e.value);
    else selectedValue.splice(selectedValue.indexOf(e.value), 1);

    setCheckboxValue(selectedValue);
  };

  const itemTemplate = (option: InputValue) => {
    return (
      <div className="flex align-items-center">
        <span
          className={`mr-2 flag flag-${option.code.toLowerCase()}`}
          style={{ width: "18px", height: "12px" }}
        />
        <span>{option.name}</span>
      </div>
    );
  };

  return (
    <div className="grid p-fluid">
      <div className="col-12 md:col-12">
        <div className="card">
          <h5>Tambahkan Data</h5>
          {/* <div className="grid formgrid">
            <div className="col-12 mb-2 lg:col-4 lg:mb-0">
              <InputText type="text" placeholder="Default"></InputText>
            </div>
            <div className="col-12 mb-2 lg:col-4 lg:mb-0">
              <InputText
                type="text"
                placeholder="Disabled"
                disabled
              ></InputText>
            </div>
            <div className="col-12 mb-2 lg:col-4 lg:mb-0">
              <InputText
                type="text"
                placeholder="Invalid"
                className="p-invalid"
              />
            </div>
          </div> */}

          {/* <h5>Icons</h5>
          <div className="grid formgrid">
            <div className="col-12 mb-2 lg:col-4 lg:mb-0">
              <span className="p-input-icon-left">
                <i className="pi pi-user" />
                <InputText type="text" placeholder="Username" />
              </span>
            </div>
            <div className="col-12 mb-2 lg:col-4 lg:mb-0">
              <span className="p-input-icon-right">
                <InputText type="text" placeholder="Search" />
                <i className="pi pi-search" />
              </span>
            </div>
            <div className="col-12 mb-2 lg:col-4 lg:mb-0">
              <span className="p-input-icon-left p-input-icon-right">
                <i className="pi pi-user" />
                <InputText type="text" placeholder="Search" />
                <i className="pi pi-search" />
              </span>
            </div>
          </div>

          <h5>Float Label</h5>
          <span className="p-float-label">
            <InputText
              id="username"
              type="text"
              value={floatValue}
              onChange={(e) => setFloatValue(e.target.value)}
            />
            <label htmlFor="username">Username</label>
          </span>

          <h5>Textarea</h5>
          <InputTextarea
            placeholder="Your Message"
            autoResize
            rows={3}
            cols={30}
          />

          <h5>AutoComplete</h5>
          <AutoComplete
            placeholder="Search"
            id="dd"
            dropdown
            multiple
            value={selectedAutoValue}
            onChange={(e) => setSelectedAutoValue(e.value)}
            suggestions={autoFilteredValue}
            completeMethod={searchCountry}
            field="name"
          />

          <h5>Calendar</h5>
          <Calendar
            showIcon
            showButtonBar
            value={calendarValue}
            onChange={(e) => setCalendarValue(e.value as Date)}
          ></Calendar>

          <h5>InputNumber</h5>
          <InputNumber
            value={inputNumberValue}
            onValueChange={(e) => setInputNumberValue(e.value ?? null)}
            showButtons
            mode="decimal"
          ></InputNumber>

          <h5>Chips</h5>
          <Chips
            value={chipsValue}
            onChange={(e) => setChipsValue(e.value ?? [])}
          /> */}
        </div>

        
      </div>

      

      
    </div>
  );
};

export default InputDemo;
