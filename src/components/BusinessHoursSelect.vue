<template>
  <div>
    <select ref="hoursSelect"
            :name="optionName"
            :disabled="isDisabled"
            v-model="selected"
            @focus="hidePlaceholder"
            @change="inputEventHandler"
            @blur="showPlaceholder">
      <option value
              disabled
              v-show="isFirstRow(index) && onlyOneRow(hours)"
              v-if="isPlaceholderVisible">
        {{ defaultText }}
      </option>
      <option value="24hrs"
              v-show="isFirstRow(index)"
              v-if="is24hrsVisible">
        {{ localization.t24hours }}
      </option>
      <option :key="time"
              :value="time"
              :selected="time == selected"
              v-for="time in filteredTimes">
        {{ time | formatTime(hourFormat24) }}
      </option>
      <option value="2400"
              v-show="showMidnightOption">
        {{ localization.midnight }}
      </option>
    </select>
  </div>
</template>

<script>
import { helperMixin } from '../mixins/helperMixin';
import { formFieldMixin } from '../mixins/formFieldMixin';
export default {
  name: 'BusinessHoursSelect',
  mixins: [helperMixin, formFieldMixin],
  props: {
    isDisabled: {
      type: Boolean,
      default: false
    },
    is24hrsVisible: {
      type: Boolean,
      default: true
    }
  },
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
    }
  }
};
</script>
<style scoped>
.placeholder-text {
  color: #878686;
}
</style>
