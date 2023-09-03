<script>
    import Header from "../components/Header.svelte";
    import Profile from "../components/Profile.svelte";
    import MyPageMenu from "../components/MyPageMenu.svelte";
    import Human from "../components/follow/Human.svelte";

    import human from '../public/images/icons/human-icon-big.svg'
    import search from '../public/images/icons/search-icon.svg'
    import arrowBottom from '../public/images/icons/arrow-bottom-icon.svg'
</script>

<div class="follow">
    <Header></Header>
    <div class="follow__contents">
        <div class="title">
            <div class="title__text--big"><img src="{human}" alt="human"> 팔로우 관리</div>
            <div class="title__text--small">개발자 노예로 살아가는 저의 페이지에 오신걸 환영합니다. 팔로우 해주세요:D Plz...</div>
        </div>
        <div class="follow__wrap">
            <div class="profile">
                <Profile></Profile>
                <MyPageMenu></MyPageMenu>
            </div>
            <div class="contents">
                <div class="contents__wrap">
                    <div class="search">
                        <img src="{search}" alt="search">
                        <input type="text" class="search__input" placeholder="아이디 검색">
                    </div>
                    <label class="order" for="order">
                        <select name="order" id="order">
                            <option value="">정렬 기준 기본</option>
                            <option value="newer">최신 순</option>
                            <option value="name">이름 순</option>
                        </select>
                    </label>
                </div>
                <div class="humans">
                    <Human></Human>
                    <Human></Human>
                    <Human></Human>
                    <Human></Human>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .follow {
        width: 100%;
        min-height: 100vh;
        background-color: #0D1117;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
    }
    .follow__contents {
        width: 1200px;
        padding-top: 100px;
    }
    .follow__wrap {
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

    .contents__wrap {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
    }
    .search {
        width: 424px;
        height: 44px;
        border-radius: 10px;
        background-color: #21262C;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        padding: 10px;
    }
    .search__input {
        background-color: transparent;
        width: 100%;
        color: #fff;
    }
    .search__input:focus {
        outline: none;
    }
    .order {
        width: 190px;
        height: 44px;
        background-color: #21262C;
        border-radius: 10px;
        display: flex;
        flex-flow: nowrap;
        padding: 10px;
    }
    #order {
        background-color: transparent;
        color: #fff;
        width: 100%;
        border-radius: 10px;
        border: none;
    }
    #order > option {
        background-color: #21262C;
        color: #fff;
        border: none;
        border-radius: 10px;
        outline: none;
    }
    .humans {
        margin-top: 20px;
        display: flex;
        flex-flow: column nowrap;
        gap: 10px;
    }
    
</style>