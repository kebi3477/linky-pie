<script>
    import Header from "../components/Header.svelte";
    import Profile from "../components/Profile.svelte";
</script>

<div class="my-page">
    <Header></Header>

    <div class="my-page__contents">
        <Profile></Profile>
        <div class="title">
            <div class="title__text--big">Welcome My Linky pie page.😄</div>
            <div class="title__text--small">개발자 노예로 살아가는 저의 페이지에 오신걸 환영합니다. 팔로우 해주세요:D Plz...</div>
        </div>
    </div>
</div>

<style>
    .my-page {
        width: 100%;
        height: 100vh;
        background-color: #0D1117;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
    }
    .my-page__contents {
        width: 1200px;
        display: grid;
        padding-top: 100px;
        grid-template-columns: 280px auto;
        gap: 30px;
    }
    
    .title {
        margin-top: -10px;
        display: flex;
        flex-flow: column;
        gap: 25px;
    }
    .title__text--big {
        font-size: 40px;
        color: #fff;
        font-family: 'Ramche', sans-serif;
    }
    .title__text--small {
        font-size: 15px;
        color: #AEAEAE;
    }
</style>