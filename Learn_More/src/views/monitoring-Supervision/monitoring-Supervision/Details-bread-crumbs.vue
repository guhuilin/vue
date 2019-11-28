<template>
            <!-- 面包屑 -->
    <div class="bread-crumbs">
        <a-breadcrumb separator=">">
            <!-- <a-breadcrumb-item>Home</a-breadcrumb-item> -->
            <a-breadcrumb-item><a href="">{{management}}</a></a-breadcrumb-item>
            <a-breadcrumb-item><a href="">{{name}}</a></a-breadcrumb-item>
            <!-- <a-breadcrumb-item>An Application</a-breadcrumb-item> -->
        </a-breadcrumb>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                name : [],
                management : []
            }
        },
        created(){
            // 路由传递过来的参数
            this.name = this.$route.query.name
            this.management = this.$route.query.management
        },
    }
</script>
<style lang="scss" scoped>
    
</style>