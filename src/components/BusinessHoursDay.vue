<template>
  <div is="transition-group" name="fade">
    <div v-for="({ open, close, id }, index) in hours" :key="id">
      <div
        class="flex-table row"
        :class="{ 'is-all-day': isAllDay(index) }"
        role="rowgroup"
      >
        <div class="flex-row day" role="cell">
          <div v-if="showDay(index)">{{ localization.days[day] }}</div>
        </div>
        <div class="flex-row toggle" role="cell">
          <button
            v-if="showDay(index) && isModern"
            type="button"
            role="switch"
            class="bh-switch"
            :class="{ 'is-on': anyOpen }"
            :aria-checked="anyOpen ? 'true' : 'false'"
            :aria-label="localization.days[day]"
            @click="
              toggleOpen();
              resetHours();
              runValidations();
            "
          >
            <span class="bh-switch__track" aria-hidden="true">
              <span class="bh-switch__knob"></span>
            </span>
            <span class="bh-switch__text" aria-hidden="true">{{
              anyOpen ? localization.switchOpen : localization.switchClosed
            }}</span>
          </button>
          <ToggleButton
            v-else-if="showDay(index)"
            @change="
              toggleOpen();
              resetHours();
              runValidations();
            "
            :value="anyOpen"
            :sync="true"
            :labels="{
              checked: localization.switchOpen,
              unchecked: localization.switchClosed
            }"
            :color="color"
            :width="switchWidth"
            :height="25"
            :font-size="12"
          />
        </div>
        <transition name="fade">
          <div class="flex-row hours open" role="cell" v-visible="isOpenToday">
            <BusinessHoursSelect
              v-if="type === 'select'"
              :name="name"
              :input-num="inputNum('open', index)"
              :total-inputs="totalInputs"
              :day="day"
              :hours="hours"
              :time-increment="timeIncrement"
              :index="index"
              :selected-time="open"
              :localization="localization"
              :hour-format24="hourFormat24"
              @input-change="onChangeEventHandler('open', index, $event)"
            ></BusinessHoursSelect>
            <BusinessHoursDatalist
              v-if="type === 'datalist'"
              :name="name"
              :input-num="inputNum('open', index)"
              :total-inputs="totalInputs"
              :day="day"
              :hours="hours"
              :time-increment="timeIncrement"
              :index="index"
              :selected-time="open"
              :any-error="anyError(validations[index].open)"
              :localization="localization"
              :hour-format24="hourFormat24"
              @input-change="onChangeEventHandler('open', index, $event)"
            ></BusinessHoursDatalist>
          </div>
        </transition>
        <transition name="fade">
          <div class="flex-row dash" role="cell" v-visible="isOpenToday">{{ separatorText }}</div>
        </transition>
        <transition name="fade">
          <div class="flex-row hours" role="cell" v-visible="isOpenToday">
            <BusinessHoursSelect
              :class="{'close': checkOpenHours(index)}"
              :isDisabled="checkOpenHours(index)"
              :name="name"
              :input-num="inputNum('close', index)"
              :total-inputs="totalInputs"
              :day="day"
              :hours="hours"
              :time-increment="timeIncrement"
              :index="index"
              :selected-time="close"
              :localization="localization"
              :hour-format24="hourFormat24"
              v-if="type === 'select'"
              @input-change="onChangeEventHandler('close', index, $event)"
            ></BusinessHoursSelect>
            <BusinessHoursDatalist
              v-if="type === 'datalist'"
              :name="name"
              :input-num="inputNum('close', index)"
              :total-inputs="totalInputs"
              :day="day"
              :hours="hours"
              :time-increment="timeIncrement"
              :index="index"
              :any-error="anyError(validations[index].close)"
              :updated-validations="validations[index].close"
              :selected-time="close"
              :hour-format24="hourFormat24"
              :localization="localization"
              @input-change="onChangeEventHandler('close', index, $event)"
            ></BusinessHoursDatalist>
          </div>
        </transition>
        <div class="flex-row remove" role="cell" v-visible="isOpenToday">
          <button
            type="button"
            class="font-awesome-button"
            v-if="showRemoveButton()"
            @click="removeRow(index)"
          >
            <FontAwesomeIcon icon="xmark" class="fa-sm" />
          </button>
        </div>
        <div class="flex-row add" role="cell" v-visible="isOpenToday">
          <button
            type="button"
            :style="{ color: color }"
            class="add-hours"
            v-if="showAddButton(index)"
            @click="addRow()"
          >{{ localization.addHours }}</button>
        </div>
      </div>
      <ul class="time-errors" v-if="validations[index].anyErrors">
        <li
          v-for="{ whichTime, error } in activeErrors(index)"
          :key="whichTime + '.' + error"
        >{{ errorMessage(whichTime, error) }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/no-mutating-props */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import uniqid from 'uniqid';
import { ToggleButton } from 'vue-js-toggle-button';
import { helperMixin } from '../mixins/helperMixin';
import { validationMixin } from '../mixins/validationMixin';
import BusinessHoursDatalist from './BusinessHoursDatalist.vue';
import BusinessHoursSelect from './BusinessHoursSelect.vue';
export default {
  name: 'BusinessHoursDay',
  components: {
    BusinessHoursSelect,
    BusinessHoursDatalist,
    ToggleButton,
    FontAwesomeIcon
  },
  mixins: [helperMixin, validationMixin],
  props: {
    day: {
      type: String,
      required: true
    },
    hours: {
      type: Array,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    timeIncrement: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    localization: {
      type: Object
    },
    switchWidth: {
      type: Number
    },
    hourFormat24: {
      type: Boolean
    },
    variant: {
      type: String,
      default: 'classic'
    }
  },
  computed: {
    isModern: function() {
      return this.variant === 'modern';
    },
    separatorText: function() {
      if (this.localization.separator) {
        return this.localization.separator;
      }

      return this.isModern ? 'to' : '-';
    },
    totalInputs: function() {
      return this.hours.length * 2;
    },
    isOpenToday: function() {
      return this.hours[0].isOpen;
    },
    anyOpen: function() {
      return this.hours.some(hour => {
        return hour.isOpen === true;
      });
    }
  },
  directives: {
    visible: function(el, binding) {
      el.style.visibility = binding.value ? 'visible' : 'hidden';
    }
  },
  mounted: function () {
    this.hours.forEach((day, index) => {
      if (day.isOpen && day.open === '24hrs') {
        this.hours[index].close = ''
      }
    });
    this.runValidations();
  },
  methods: {
    onChangeEventHandler: function(whichTime, index, value) {
      value = this.backendInputFormat(value);

      if (value == '24hrs') {
        this.hours.splice(1);
        this.hours[0].open = this.hours[0].close = value;
        this.runValidations();
        this.updateHours();

        return;
      }

      if (
        (this.hours[index].open == '24hrs' ||
          this.hours[index].close == '24hrs') &&
        value == ''
      ) {
        this.hours[index].open = this.hours[index].close = value;
        this.runValidations();
        this.updateHours();
        return;
      }

      if (
        !this.onlyOneRow(this.hours) &&
        value === '' &&
        ((whichTime === 'open' && this.hours[index].close === '') ||
          (whichTime === 'close' && this.hours[index].open === ''))
      ) {
        this.removeRow(index);
        this.runValidations();
        this.updateHours();
        return;
      }

      //If change the opening hours, it is necessary to send the empty closing to add the default 9 hours
      if (whichTime === 'open') {
        this.hours[index]['close'] = ''
      }

      this.hours[index][whichTime] = value;
      this.runValidations();
      this.updateHours();
    },
    inputNum: function(whichTime, index) {
      if (whichTime === 'open') {
        return index * 2 + 1;
      } else if (whichTime === 'close') {
        return index * 2 + 2;
      }
    },
    toggleOpen: function() {
      this.hours[0].isOpen = this.hours[0].isOpen ? false : true;
    },
    resetHours: function() {
      this.hours.splice(1);
      this.hours[0].open = this.hours[0].close = '';
      this.updateHours();
    },
    addRow: function() {
      this.hours.push({
        id: uniqid(),
        open: '',
        close: '',
        isOpen: true
      });
      this.runValidations();
      this.updateHours();
    },
    removeRow: function(index) {
      this.hours.splice(index, 1);
      this.runValidations();
      this.updateHours();
    },
    showDay: function(index) {
      return index > 0 ? false : true;
    },
    showRemoveButton: function() {
      return this.hours.length > 1 ? true : false;
    },
    showAddButton: function(index) {
      return this.hours.length === index + 1 &&
        this.hours[index].open !== '' &&
        this.hours[index].close !== '' &&
        this.hours[index].open !== '24hrs' &&
        this.hours[index].close !== '24hrs' &&
        !(
          this.type === 'select' &&
          this.timeIncrement === 15 &&
          this.hours[index].close === '2345'
        ) &&
        !(
          this.type === 'select' &&
          this.timeIncrement === 30 &&
          this.hours[index].close === '2330'
        ) &&
        !(
          this.type === 'select' &&
          this.timeIncrement === 60 &&
          this.hours[index].close === '2300'
        ) &&
        this.hours[index].close !== '2400' &&
        this.validations[index].anyErrors === false
        ? true
        : false;
    },
    updateHours: function() {
      const updatedHours = { [this.day]: this.hours };
      this.$emit('hours-change', updatedHours);
    },
    isAllDay: function(index) {
      return this.hours[index].open === '24hrs';
    },
    checkOpenHours: function (index) {
      return !this.hours[index]['open'] || this.hours[index]['open'] === '24hrs'
    }
  }
};
</script>

<style lang="scss" scoped>
.flex-table {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin: 0.75em 0;
  height: 45px;
  width: 100%;
}

.flex-row {
  width: 20%;
}

.flex-row ::v-deep input,
.flex-row ::v-deep select {
  margin: 1px;
  padding: 3px 5px;
  width: 110px;
  height: 28px;
  font-size: 14px;
  line-height: 28px;
  vertical-align: middle;
  border: 1px solid #d5d5d5;
  box-sizing: border-box;
}

.flex-row.day {
  width: 130px;
}

.flex-row.hours {
  width: 110px;
}

div.hours::after{
  pointer-events: none;
}

.flex-row.dash {
  margin: 0 7px;
  width: 4px;
}

.row-container {
  flex-direction: column;
}

.row {
  flex-direction: row;
}

.remove {
  display: flex;
  justify-content: center;
  width: 50px;
}

label.vue-js-switch {
  margin-bottom: 0;
}

button.add-hours,
button.font-awesome-button {
  height: 30px;
  background-color: transparent;
  border-color: transparent;
  border-style: none;
  border-width: 0;
  padding: 0;
  cursor: pointer;
}

button.add-hours:focus,
button.font-awesome-button:focus {
  outline: none;
}

button.font-awesome-button {
  width: 30px;
  font-size: 24px;
}

button.add-hours {
  font-size: 14px;
  font-weight: bold;
}

.fa-times {
  color: #3d4852;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter,
.fade-leave-to
  /* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.time-errors {
  margin: 0;
  padding: 0;
  font-size: 12px;
  color: #e3342f;
  list-style: none;
}

.time-errors li {
  margin-bottom: 6px;
}

/* Modern variant. Each value reads a CSS variable first, so a page can match its own form styles. */
.business-hours-container--modern .flex-table {
  flex-wrap: wrap;
  gap: 8px 12px;
  height: auto;
  margin: 0 0 8px;
}

.business-hours-container--modern .flex-row {
  width: auto;
  margin: 0;
}

.business-hours-container--modern .flex-row.day {
  width: 6.5rem;
  font-size: var(--bh-font-size, 13px);
}

.business-hours-container--modern .flex-row.toggle {
  width: 5.75rem;
}

.business-hours-container--modern .flex-row.hours {
  width: 9rem;
}

.business-hours-container--modern .flex-row.dash {
  color: var(--bh-text-muted, #667085);
  font-size: var(--bh-font-size, 13px);
}

.business-hours-container--modern .flex-row ::v-deep input,
.business-hours-container--modern .flex-row ::v-deep select {
  width: 100%;
  height: var(--bh-control-height, 32px);
  margin: 0;
  padding: 0 8px;
  border: 1px solid var(--bh-border, #d0d5dd);
  border-radius: var(--bh-radius, 6px);
  background-color: #fff;
  color: inherit;
  font: inherit;
  font-size: var(--bh-font-size, 13px);
  line-height: normal;
}

.business-hours-container--modern .flex-row ::v-deep input:focus,
.business-hours-container--modern .flex-row ::v-deep select:focus {
  border-color: var(--bh-switch-on, var(--bh-switch-on-color));
  outline: 0;
}

/* 24 hours needs no closing time */
.business-hours-container--modern .is-all-day > .dash,
.business-hours-container--modern .is-all-day > .hours:not(.open) {
  display: none;
}

.business-hours-container--modern button.add-hours {
  font-size: var(--bh-font-size, 13px);
  font-weight: 600;
}

.business-hours-container--modern button.font-awesome-button {
  font-size: 16px;
}

.business-hours-container--modern .time-errors {
  margin-bottom: 8px;
}

.bh-switch {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--bh-text-muted, #667085);
  font: inherit;
  font-size: var(--bh-font-size, 13px);
  cursor: pointer;
}

.bh-switch.is-on {
  color: inherit;
}

.bh-switch:focus-visible {
  border-radius: 999px;
  outline: 2px solid var(--bh-focus, rgba(18, 183, 106, 0.45));
  outline-offset: 2px;
}

.bh-switch__track {
  position: relative;
  flex: none;
  width: 40px;
  height: 20px;
  border-radius: 999px;
  background-color: var(--bh-switch-off, #dcdfe6);
  transition: background-color 0.2s ease;
}

.bh-switch.is-on .bh-switch__track {
  background-color: var(--bh-switch-on, var(--bh-switch-on-color));
}

.bh-switch__knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.12);
  transition: transform 0.2s ease;
}

.bh-switch.is-on .bh-switch__knob {
  transform: translateX(20px);
}

/* On a phone the day and its switch share a line, and the hours take the next one */
@media (max-width: 575.98px) {
  .business-hours-container--modern .flex-table {
    display: grid;
    grid-template-areas:
      'day day toggle'
      'open dash close';
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  }

  .business-hours-container--modern .flex-row.day {
    grid-area: day;
    width: auto;
  }

  .business-hours-container--modern .flex-row.toggle {
    grid-area: toggle;
    justify-self: end;
    width: auto;
  }

  .business-hours-container--modern .flex-row.hours {
    width: auto;
  }

  .business-hours-container--modern .flex-row.hours.open {
    grid-area: open;
  }

  .business-hours-container--modern .flex-row.dash {
    grid-area: dash;
  }

  .business-hours-container--modern .flex-row.hours:not(.open) {
    grid-area: close;
  }

  .business-hours-container--modern .is-all-day > .flex-row.hours.open {
    grid-column: 1 / -1;
  }

  .business-hours-container--modern .flex-row.remove,
  .business-hours-container--modern .flex-row.add {
    grid-column: 1 / -1;
  }

  /* With no button in them they would still take a grid row each */
  .business-hours-container--modern .flex-row.remove:empty,
  .business-hours-container--modern .flex-row.add:empty {
    display: none;
  }

  /* A closed day keeps no empty second row */
  .business-hours-container--modern .flex-row[style*='visibility: hidden'] {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bh-switch__track,
  .bh-switch__knob {
    transition: none;
  }
}
</style>
