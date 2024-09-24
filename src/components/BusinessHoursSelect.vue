<template>
  <select :name="optionName"
          :class="selectClass" 
          v-model="selected" 
          :disabled="isDisabled"
          @focus="hidePlaceholder" 
          @change="inputEventHandler" 
          @blur="showPlaceholder">
    <option v-show="isFirstRow(index) && onlyOneRow(hours)" 
            value 
            disabled 
            selected 
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
      isPlaceholderVisible: true,
    }
  },
  computed: {
    selectClass() {
      if (this.selected === "" || this.selected === "") {
        return "placeholder-text"; // Apply custom class
      } else {
        return "";
      }
    }
  },
  methods: {
    hidePlaceholder() {
      this.isPlaceholderVisible = false;
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
