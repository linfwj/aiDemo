<template>
  <div>
    <!-- Test case for two Luban classes -->
    <div class="LubanHeader LubanContent">
      Test Content
    </div>
    
    <!-- Test case with non-Luban class -->
    <div class="LubanHeader OtherClass">
      Should not merge
    </div>
    
    <!-- Test case with three Luban classes -->
    <div class="LubanHeader LubanContent LubanFooter">
      Should only merge first two
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestComponent'
}
</script>

<style lang="scss">
@import '../styles/test.scss';
</style>
