<script>
    import Header from "../components/Header.svelte";
    import Profile from "../components/Profile.svelte";
    import MyPageMenu from "../components/MyPageMenu.svelte";

    import folder from '../public/images/icons/folder-icon-big.svg'
    import search from '../public/images/icons/search-icon.svg'
    import arrowBottom from '../public/images/icons/arrow-bottom-icon.svg'
</script>

<div class="group">
    <Header></Header>
    <div class="group__contents">
        <div class="title">
            <div class="title__text--big"><img src="{folder}" alt="folder"> 그룹 관리</div>
            <div class="title__text--small">이 곳은 당신의 그룹을 수정할 수 있어</div>
        </div>
        <div class="group__wrap">
            <div class="profile">
                <Profile></Profile>
                <MyPageMenu></MyPageMenu>
            </div>
            <div class="contents">
            </div>
        </div>
    </div>
</div>
<style>
    .group {
        width: 100%;
        height: 100vh;
        background-color: #0D1117;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
    }
    .group__contents {
        width: 1200px;
        padding-top: 100px;
    }
    .group__wrap {
        display: grid;
        grid-template-columns: 280px auto;
        gap: 30px;
        margin-top: 60px;
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
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
    }
    .title__text--small {
        font-size: 15px;
        color: #AEAEAE;
    }
</style>