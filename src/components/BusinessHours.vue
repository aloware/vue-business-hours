<template>
  <div class="business-hours-container">
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
      :localization="localization"
      :switch-width="switchWidth"
      :hour-format24="hourFormat24"
    ></business-hours-day>
  </div>
</template>

<script>
import BusinessHoursDay from './BusinessHoursDay.vue';
export default {
  name: 'BusinessHours',
  components: {
    BusinessHoursDay
  },
  data() {
    return {
      minutesPerHour: 60,
      additionalHours: 9
    }
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
    localization: {
      type: Object,
      default: () => ({
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
            'Please enter a closing time in the 12 hour format (ie. 05:00 PM). You may also enter "24 hours" or "Midnight".',
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
      })
    },
    switchWidth: {
      type: Number,
      default: 90
    },
    hourFormat24: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hoursChange: function(val) {
      val = this.setTime(val)
      this.$emit('updated-hours', val);
    },
    calculateOpenTime(closeTime) {
      const minHours = 0; // 12:00 AM is represented as 0 hours
      const [hours, minutes] = [
        parseInt(closeTime.substring(0, 2), 10),
        parseInt(closeTime.substring(2, 4), 10),
      ];

      // Calculate the total minutes of the closing time
      let totalMinutes = hours * this.minutesPerHour + minutes - (this.additionalHours * this.minutesPerHour);

      // If the calculated open time is earlier than 12:00 AM, set it to 12:00 AM
      if (totalMinutes < minHours * this.minutesPerHour) {
        totalMinutes = minHours * this.minutesPerHour;
      }

      // Calculate the new hours and minutes for the open time
      let newHours = Math.floor(totalMinutes / this.minutesPerHour);
      let newMinutes = totalMinutes % this.minutesPerHour;

      // Format the new open time as a string with padded zeros
      return String(newHours).padStart(2, '0') + String(newMinutes).padStart(2, '0');
    },
    calculateCloseTime(openTime) {
      const maxHours = 23;
      const [hours, minutes] = [
        parseInt(openTime.substring(0, 2), 10),
        parseInt(openTime.substring(2, 4), 10),
      ];

      let totalMinutes = hours * this.minutesPerHour + minutes + (this.additionalHours * this.minutesPerHour);
      const maxMinutes = maxHours * this.minutesPerHour + 60;

      if (totalMinutes > maxMinutes) {
        totalMinutes = maxMinutes;
      }

      let newHours = Math.floor(totalMinutes / this.minutesPerHour);
      let newMinutes = totalMinutes % this.minutesPerHour;

      return String(newHours).padStart(2, '0') + String(newMinutes).padStart(2, '0');
    },
    setTime(val) {
      const key = Object.keys(val)[0];

      val[key].forEach((day, index) => {
        if (day.isOpen && day.close !== '24hrs' && day.close !== '' && day.open === '') {
          val[key][index].open = this.calculateOpenTime(day.close);
        }

        if (day.isOpen && day.open !== '24hrs' && day.open !== '' && (day.close === '' || day.close === '24hrs')) {
          val[key][index].close = this.calculateCloseTime(day.open);
        }

        if(day.isOpen && day.open === '24hrs') {
          val[key][index].close = '';
        }

        if (day.open === '' && day.isOpen) {
          val[key][index].close = '';
        }
      });

      return val;
    },
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
</style>
