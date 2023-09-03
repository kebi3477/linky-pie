<script>
    import Header from "../components/Header.svelte";
    import Profile from "../components/Profile.svelte";
    import MyPageMenu from "../components/MyPageMenu.svelte";
    import Block from "../components/Block.svelte";

    import info from '../public/images/icons/infomation-icon.svg';
    import leftArrow from '../public/images/icons/arrow-left-icon.svg';
    import rightArrow from '../public/images/icons/arrow-right-icon.svg';
</script>

<div class="my-page">
    <Header></Header>

    <div class="my-page__contents">
        <div class="title">
            <div class="title__text--big">Welcome My Linky pie page.😄</div>
            <div class="title__text--small">개발자 노예로 살아가는 저의 페이지에 오신걸 환영합니다. 팔로우 해주세요:D Plz...</div>
        </div>
        <div class="my-page__wrap">
            <div class="profile">
                <Profile></Profile>
                <MyPageMenu></MyPageMenu>
            </div>
            <div class="contents">
                <div class="calendar">
                    <div class="calendar__title">2023년 8월 22일 셋째주<img src="{info}" alt="infomation" /></div>
                    <div class="calendar__wrap">
                        <div class="calendar__arrow"><img src="{leftArrow}" alt="left-arrow" /></div>
                        <div class="calendar__day">
                            <div class="calendar__text--middle">Sun</div>
                            <div class="calendar__text--big">02</div>
                            <div class="calendar__text--middle">20</div>
                        </div>
                        <div class="calendar__day">
                            <div class="calendar__text--middle">Mon</div>
                            <div class="calendar__text--big">12</div>
                            <div class="calendar__text--middle">21</div>
                        </div>
                        <div class="calendar__day active">
                            <div class="calendar__text--middle">Sat</div>
                            <div class="calendar__text--big">25</div>
                            <div class="calendar__text--middle">22</div>
                        </div>
                        <div class="calendar__day">
                            <div class="calendar__text--middle">Wed</div>
                            <div class="calendar__text--big">00</div>
                            <div class="calendar__text--middle">23</div>
                        </div>
                        <div class="calendar__day">
                            <div class="calendar__text--middle">Tue</div>
                            <div class="calendar__text--big">00</div>
                            <div class="calendar__text--middle">23</div>
                        </div>
                        <div class="calendar__day">
                            <div class="calendar__text--middle">Fri</div>
                            <div class="calendar__text--big">00</div>
                            <div class="calendar__text--middle">24</div>
                        </div>
                        <div class="calendar__day">
                            <div class="calendar__text--middle">Sat</div>
                            <div class="calendar__text--big">00</div>
                            <div class="calendar__text--middle">25</div>
                        </div>
                        <div class="calendar__arrow"><img src="{rightArrow}" alt="right-arrow" /></div>
                    </div>
                </div>
                <div class="folders">
                    <div class="folder__item active">폴더1</div>
                    <div class="folder__item">폴더2</div>
                    <div class="folder__item">폴더3</div>
                    <div class="folder__item">폴더4</div>
                    <div class="folder__item">폴더5</div>
                    <div class="folder__item">+</div>
                </div>
                <div class="blocks">
                    <Block></Block>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .my-page {
        width: 100%;
        min-height: 100vh;
        background-color: #0D1117;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
    }
    .my-page__contents {
        width: 1200px;
        padding-top: 100px;
    }
    .my-page__wrap {
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
    }
    .title__text--small {
        font-size: 15px;
        color: #AEAEAE;
    }

    .calendar {
        width: 100%;
        background-color: #21262C;
        height: 244px;
        border-radius: 10px;
        padding: 20px;
    }
    .calendar__title {
        font-size: 15px;
        color: #fff;
        font-family: 'Ramche', sans-serif;
        display: flex;
        align-items: center;
        gap: 5px;
    }
    .calendar__wrap {
        width: 100%;
        display: grid;
        grid-template-columns: .5fr repeat(7, 1fr) .5fr;
        padding: 20px 0;
        gap: 2.5rem;
        align-items: center;
        justify-content: center;
    }
    .calendar__arrow {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .calendar__day {
        display: grid;
        align-items: center;
        height: 110px;
        justify-content: center;
        grid-template-rows: repeat(3, 1fr);
        text-align: center;
        border-radius: 10px;
        cursor: pointer;
    }
    .calendar__day.active {
        background-color: #2F81F7;
        color: #fff;
    }
    .calendar__day.active > div {
        color: #fff;
    }
    .calendar__text--middle {
        color: #848484;
        font-size: 13px;
    }
    .calendar__text--big {
        color: #343B43;
        font-size: 30px;
        font-weight: bold;  
    }

    .folders {
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        gap: 5px;
        margin-top: 55px;
    }
    .folder__item {
        width: 95px;
        height: 45px;
        background-color: #21262C;
        color: #757575;
        font-family: 'Ramche', sans-serif;
        font-size: 15px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
    .folder__item.active {
        background-color: #2F81F7;
        color: #fff;
    }
    .blocks {
        margin-top: 20px;
    }
</style>