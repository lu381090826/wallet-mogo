<template>
  <div class="tg-field" style="margin-top: 6%" :style="{borderBottomColor:borderBottomColor}">
    <van-row type="flex" justify="start">
      <van-col span="18" class="tg-field-label">
        <div>
          <van-row type="flex" justify="start">
            <van-col span="20">
              <input :placeholder="placeholder"
                     v-model="currentValue"
                     :type="type"
                     class="tg-field-input"
                     @input="handleModelInput"
                     title="ss"/>
            </van-col>
            <van-col span="4">
              <van-icon name="cross" color="gray" size="20px" v-show="value"
                        @click="clear()"></van-icon>
            </van-col>
          </van-row>
        </div>
      </van-col>
    </van-row>
  </div>
</template>
<script>
  export default {
    name: 'tg-field',
    props: {
      value: [String, Number],
      placeholder: {},
      type: '',
    },
    data() {
      return {
        currentValue: "",
        borderBottomColor: 'lightgray',
      }
    },
    methods: {
      handleModelInput() {
        this.$emit('change', this.currentValue)
      },
      onBlur() {
        if (this.borderBottomColor === '#1287ca') {
          this.borderBottomColor = "lightgray";
        } else {
          this.borderBottomColor = "#1287ca";
        }
      },
      onFocus() {
        if (this.borderBottomColor === 'lightgray') {
          this.borderBottomColor = "#1287ca";
        } else {
          this.borderBottomColor = "#lightgray";
        }
      },
      clear() {
        this.currentValue = "";
      },
    },
    watch: {
      value(newValue) {
        this.currentValue = newValue;
      }
    }
  }
</script>
