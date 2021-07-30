// Copyright 2021 Splunk Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const defaultSelectedValues = ["base-event", "reserved", "classification", "context", "occurrence", "origination", "primary"];
const selectAttributes = "#attributes-select";

function hide(name) {
  $(name).addClass('d-none');
}

function show(name) {
  $(name).removeClass('d-none');
}

function enable_option(name) {
  $(name).removeAttr('disabled');
}

function show_select_attributes(list) {
  show(selectAttributes);
}

function init_select() {
  const name = selectAttributes;
  let selection = $(name);
  let selected;

  if (window.localStorage.getItem(name) == null) {
    selected = defaultSelectedValues;
    window.localStorage.setItem(name, selected);
  } else {
    const data = window.localStorage.getItem(name);
    if (data.length > 0)
      selected = data.split(",");
    else
      selected = [];
  }

  $(selectAttributes).selectpicker();

  selection.selectpicker('val', selected);

  display_attributes(array_to_set(selected));

  selection.on('changed.bs.select', function (e, clickedIndex, isSelected, oldValues) {
    const values = [];

    for (let i = 0; i < this.length; i++) {
      const option = this[i].value;
      if (this[i].selected)
        values.push(option);
      else
        hideAll = true;
    }
    window.localStorage.setItem(name, values);
    display_attributes(new Set(values));

//
//    if (clickedIndex == null) {
//      if (this[this.length-1].selected)
//        show_attributes();
//      else
//        hide_attributes();
//    } else {
//      display_attributes(new Set(values));
//    }
  });

  return selected;
}

function show_attributes() {
  const rows = document.getElementById('data-table').rows;
  for (let i = 1; i < rows.length; i++) {
    rows[i].classList.remove('d-none');
  }
}

function hide_attributes() {
  const rows = document.getElementById('data-table').rows;
  for (let i = 1; i < rows.length; i++) {
    rows[i].classList.add('d-none');
  }
}

function display_attributes(options) {
  const table = document.getElementById('data-table');

  if (table != null) {
    // add classes that are always shown
    options.add("event");
    options.add("conclusion");
    options.add("required");
    options.add("recommended");
    options.add("no-group");

    const rows = table.rows;
    const length = rows.length;

    for (let i = 1; i < length; i++) {
      const classList = rows[i].classList;
      const delta = intersection(array_to_set(classList), options);

      display_row(delta, classList);
    }
  }
}

function array_to_set(a) {
  return new Set(a);
}

function intersection(setA, setB) {
    let _intersection = new Set()
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem)
        }
    }
    return _intersection
}

function display_row(set, classList) {
  if (set.size == 3)
    classList.remove('d-none');
  else
    classList.add('d-none');
}

/* Table search function */
function searchInTable() {
  const input = document.getElementById("tableSearch");
  const filter = input.value.toUpperCase();
  const tbody = document.getElementsByClassName("searchable");

  for (let t = 0; t < tbody.length; t++) {
    let tr = tbody[t].children;

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      const row = tr[i];
      const children = row.children;
      let hide = true;
      if (children.length > 2) {
        for (let j = 0; hide && j < children.length - 1; j++) {
          const value = children[j].innerText;
          hide = value.toUpperCase().indexOf(filter) < 0;
        }
      }
      else {
        const value = children[0].innerText;
        hide = value.toUpperCase().indexOf(filter) < 0;
      }

      if (hide)
        row.style.display = "none";
      else
        row.style.display = "";
    }
  }
}
