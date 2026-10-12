<template>
  <div
    class="business-hours-container"
    :class="{ 'business-hours-container--modern': isModern }"
    :style="isModern ? { '--bh-switch-on-color': color } : null"
  >
    <business-hours-day
      v-for="(hours, day) in days"
      @hours-change="hoursChange"
      :key="day"
      :day="day"
      :hours="hours"
      :name="name"
      :time-increment="timeIncrement"
      :type="type"
      :color="color"
      :localization="mergedLocalization"
      :switch-width="switchWidth"
      :hour-format24="hourFormat24"
      :variant="variant"
    ></business-hours-day>
  </div>
</template>

<script>
import BusinessHoursDay from './BusinessHoursDay.vue';

const defaultLocalization = () => ({
  switchOpen: 'Open',
  switchClosed: 'Closed',
  placeholderOpens: 'Open',
  placeholderCloses: 'Closed',
  addHours: 'Add hours',
  open: {
    invalidInput:
      'Please enter an opening time in the 12 hour format (ie. 08:00 AM). You may also enter "24 hours".',
    greaterThanNext:
      'Please enter an opening time that is before the closing time.',
    lessThanPrevious:
      'Please enter an opening time that is after the previous closing time.',
    midnightNotLast:
      "Midnight can only be selected for the day's last closing time."
  },
  close: {
    invalidInput:
      'Please enter a closing time. You may also enter "24 hours" or "Midnight".',
    greaterThanNext:
      'Please enter a closing time that is after the opening time.',
    lessThanPrevious:
      'Please enter a closing time that is before the next opening time.',
    midnightNotLast:
      "Midnight can only be selected for the day's last closing time."
  },
  t24hours: '24 hours',
  midnight: 'Midnight',
  days: {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
    newYearsEve: 'New Year\'s Eve', // prettier-ignore
    newYearsDay: 'New Year\'s Day', // prettier-ignore
    martinLutherKingJrDay: 'Martin Luther King, Jr. Day',
    presidentsDay: 'Presidents\' Day', // prettier-ignore
    easter: 'Easter',
    memorialDay: 'Memorial Day',
    independenceDay: 'Independence Day',
    fourthOfJuly: '4th of July',
    laborDay: 'Labor Day',
    columbusDay: 'Columbus Day',
    veteransDay: 'Veterans Day',
    thanksgiving: 'Thanksgiving',
    christmasEve: 'Christmas Eve',
    christmas: 'Christmas'
  }
});

export default {
  name: 'BusinessHours',
  components: {
    BusinessHoursDay
  },
  props: {
    days: {
      type: Object,
      required: true
    },
    name: {
      type: String,
      default: 'businessHours'
    },
    type: {
      type: String,
      default: 'datalist',
      validator: function(value) {
        return ['datalist', 'select'].indexOf(value) !== -1;
      }
    },
    timeIncrement: {
      type: Number,
      default: 30,
      validator: function(value) {
        return [15, 30, 60].indexOf(value) !== -1;
      }
    },
    color: {
      type: String,
      default: '#2779bd',
      validator: function(value) {
        return value.charAt(0) === '#' ? true : false;
      }
    },
    // Any keys left out fall back to the defaults, so a partial object is enough
    localization: {
      type: Object,
      default: defaultLocalization
    },
    switchWidth: {
      type: Number,
      default: 90
    },
    hourFormat24: {
      type: Boolean,
      default: false
    },
    // 'modern': a plain switch with Open or Closed beside it, "to" between the times, one select for a 24-hour
    // day, and the page's font. Its colors and sizes come from the CSS variables listed in the README.
    variant: {
      type: String,
      default: 'classic',
      validator: function(value) {
        return ['classic', 'modern'].indexOf(value) !== -1;
      }
    }
  },
  computed: {
    isModern: function() {
      return this.variant === 'modern';
    },
    mergedLocalization: function() {
      const defaults = defaultLocalization();
      const given = this.localization || {};

      return {
        ...defaults,
        ...given,
        open: { ...defaults.open, ...given.open },
        close: { ...defaults.close, ...given.close },
        days: { ...defaults.days, ...given.days }
      };
    }
  },
  methods: {
    hoursChange: function(val) {
      this.$emit('updated-hours', val);
    }
  }
};
</script>

<style scoped>
.business-hours-container {
  display: block;
  width: 100%;
  /* max-width: 630px; */
  font-family: -apple-system, Helvetica, Arial, sans-serif;
  font-size: 15px;
  color: #3d4852;
}

.business-hours-container--modern {
  font-family: inherit;
  font-size: inherit;
  color: var(--bh-text, inherit);
}
</style>
