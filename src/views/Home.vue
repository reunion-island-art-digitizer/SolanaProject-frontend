<template>
  <section>
    <main class="container">
      <IndexInfo/>
      <TokenList isHome="1" class="card-border"/>
    </main>
  </section>
</template>

<script>
import IndexInfo from '@/components/IndexInfo'
import TokenList from '@/components/TokenList'
export default {
  components:{IndexInfo,TokenList},
}
</script>
