<template>
  <div>
    <Trans></Trans>
  </div>
</template>
<script>
  import Trans from '@/components/Trans'

  export default {
    data() {
      return {}
    },
    components: {
      Trans
    }
  }
</script>
<style scoped>
  a:-webkit-any-link {
    color: #8c8c8c;
    cursor: pointer;
    text-decoration: none;
  }

  .mint-cell-title {
    -ms-flex: 1;
    flex: 1;
    margin-top: 5%;
  }

  .mint-cell img {
    vertical-align: top;
  }

  .cell {
    margin-top: 1%;
    padding-top: 2%;
  }

  .cellsymbol {
    font-weight: bold;
    color: #ffc107;
    margin-left: 2%;
  }

  .from-to {
    color: black;
    font-weight: bold;
  }
</style>
