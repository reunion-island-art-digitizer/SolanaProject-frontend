<template>
  <section>
    <main class="container">
      <IndexInfo isHome="1" class="card-border mb-40" v-if="sidebar.Index"/>
      <TVLInfo/>
      <TokenList isHome="1" class="card-border"/>
    </main>
  </section>
</template>

<script>
import TVLInfo from '@/components/TVLInfo'
import IndexInfo from '@/components/IndexInfo'
import TokenList from '@/components/TokenList'
export default {
  components:{TVLInfo,IndexInfo,TokenList},
}
</script>
