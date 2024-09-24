<template>
  <select ref="hoursSelect"
          :name="optionName"
          v-model="selected" 
          :disabled="isDisabled"
          @focus="hidePlaceholder" 
          @change="inputEventHandler" 
          @blur="showPlaceholder">
    <option value
            disabled
            selected
            v-show="isFirstRow(index) && onlyOneRow(hours)"
            v-if="isPlaceholderVisible"
            class="placeholder-text"
            >
      {{ defaultText}}
    </option>
    <option value="24hrs"
            v-show="isFirstRow(index)"
            v-if="is24hrsVisible"
            >
      {{
      localization.t24hours
    }}</option>
    <option
      v-for="time in filteredTimes"
      :key="time"
      :value="time"
      :selected="time == selected"
      >{{ time | formatTime(hourFormat24) }}</option
    >
    <option v-show="showMidnightOption" value="2400">{{
      localization.midnight
    }}</option>
  </select>
</template>

<script>
import { helperMixin } from '../mixins/helperMixin';
import { formFieldMixin } from '../mixins/formFieldMixin';
export default {
  name: 'BusinessHoursSelect',
  mixins: [helperMixin, formFieldMixin],
  data () {
    return {
      isPlaceholderVisible: true
    }
  },
  methods: {
    hidePlaceholder() {
      this.isPlaceholderVisible = false;
      this.$refs.hoursSelect.blur();
    },
    showPlaceholder() {
      this.isPlaceholderVisible = true;
    },
  },
  props: {
    isDisabled: {
      type: Boolean,
      default: false
    },
    is24hrsVisible: {
      type: Boolean,
      default: true
    },
  }
};
</script>

<style scoped>

.placeholder-text {
  color: #878686; 
}

</style>
