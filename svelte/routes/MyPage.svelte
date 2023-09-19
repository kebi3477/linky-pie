<script>
    import { onMount } from 'svelte';
    import { userData } from '../utils/store.js';
    import { writable } from 'svelte/store';

    import Header from "../components/Header.svelte";
    import Profile from "../components/Profile.svelte";
    import Loading from '../components/Loading.svelte';
    import MyPageMenu from "../components/MyPageMenu.svelte";
    import Block from "../components/Block.svelte";
    import GroupPopup from "../components/group/GroupPopup.svelte";
    import BlockPopup from '../components/block/BlockPopup.svelte';

    import info from '../public/images/icons/infomation-icon.svg';
    import leftArrow from '../public/images/icons/arrow-left-icon.svg';
    import rightArrow from '../public/images/icons/arrow-right-icon.svg';

    let loading;
    let isGroupPopupShow = false;
    let isBlockPopupShow = false;
    let isCreate = true;
    let id = '';
    let title = '';
    let type = '2';
    let groups = [];
    let user = {
        id: '',
        name: '',
        image: '',
        followers: 0,
        following: 0
    };
    let today = new Date();
    let days = [];
    let selectGroupId = '';
    const activeDate = writable(new Date());

    const showGroupPopup = () => {
        isCreate = true;
        id = '';
        title = '';
        type = '2';
        isGroupPopupShow = true;
    }

    const closeGroupPopup = () => {
        isGroupPopupShow = false;
    }

    const changeGroups = async (event) => {
        if (event.detail.isCreate) {
            groups = await getGroups();
        }
    }

    const getGroups = async () => {
        try {
            const res = await fetch('/api/groups');
            
            if (res.status === 200) {
                return res.json();
            } else {
                return [];
            }
        } catch (err) {
            return [];
        }      
    }

    const getWeekNumber = (date) => {
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const pastDayOfMonth = (date - firstDayOfMonth + 86400000) / 86400000;

        return Math.ceil((pastDayOfMonth + firstDayOfMonth.getDay() + 1) / 7) - 1;
    }

    const generateWeek = (date) => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());

        const endOfWeek = new Date(date);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const newDays = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(day.getDate() + i);
            newDays.push(day);
        }

        days = [...newDays];

        return {
            start: startOfWeek,
            end: endOfWeek,
            weekNumber: getWeekNumber(startOfWeek)
        };
    }

    let currentWeek = generateWeek(today);

    const moveWeek = (diff) => {
        today.setDate(today.getDate() + (diff * 7));
        currentWeek = generateWeek(today);
    };

    const checkSelectDate = (active, current) => {
        const activeTime = new Date(active).setHours(0, 0, 0, 0);
        const currentTime = new Date(current).setHours(0, 0, 0, 0);
        
        return activeTime === currentTime;
    }
    
    const selectDate = (date) => {
        activeDate.set(date);
    }

    const showBlockPopup = (groupId) => {
        isBlockPopupShow = true;
        selectGroupId = groupId;
    }

    const closeBlockPopup = () => {
        isBlockPopupShow = false;
    }

    const getCountByWeek = async () => {
        try {
            const res = await fetch(`/api/blocks/counts/week?date=${days[0]}`);
            
            if (res.status === 200) {
                return res.json();
            } else {
                return [];
            }
        } catch (err) {
            return [];
        }      
    }

    const setCountInDays = (dates) => {
        let tempDays = [];

        for (let i = 0; i < days.length; i++) {
            if (dates[i]) {
                days[i].count = dates[i].count;
                tempDays[i] = days[i];
            }
        }

        days = tempDays;
    }

    onMount(async () => {
        user = {
            id: $userData.id,
            name: $userData.name,
            image: $userData.image,
            followers: $userData.followerCount ?? 0,
            following: $userData.followingCount ?? 0
        };
        groups = await getGroups();
        generateWeek(today);
        setCountInDays(await getCountByWeek());
    })
</script>

<Loading bind:this={loading}></Loading>
<div class="my-page">
    <Header></Header>
    <div class="my-page__contents">
        <div class="title">
            <div class="title__text--big">Welcome My Linky pie page.😄</div>
            <div class="title__text--small">개발자 노예로 살아가는 저의 페이지에 오신걸 환영합니다. 팔로우 해주세요:D Plz...</div>
        </div>
        <div class="my-page__wrap">
            <div class="profile">
                <Profile user={user}></Profile>
                <MyPageMenu></MyPageMenu>
            </div>
            <div class="contents">
                <div class="calendar">
                    <div class="calendar__title">{currentWeek.start.getFullYear()}년 {currentWeek.start.getMonth() + 1}월 {currentWeek.weekNumber}째주<img src="{info}" alt="infomation" /></div>
                    <div class="calendar__wrap">
                        <button class="calendar__arrow" on:click={() => moveWeek(-1)}><img src="{leftArrow}" alt="left-arrow" /></button>
                        {#each days as day, index}
                        <button class="calendar__day" class:active={checkSelectDate($activeDate, day)} on:click={() => selectDate(day)}>
                            <div class="calendar__text--middle">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.getDay()]}</div>
                            <div class="calendar__text--big">{day.count ?? 0}</div>
                            <div class="calendar__text--middle">{day.getDate()}</div>
                        </button>
                        {/each}
                        <button class="calendar__arrow" on:click={() => moveWeek(1)}><img src="{rightArrow}" alt="right-arrow" /></button>
                    </div>
                </div>
                <div class="groups">
                    {#each groups as item}
                        <button class="group__item" on:click={() => showBlockPopup(item.id)}>{item.title}</button>
                    {/each}
                    <button class="group__item" on:click={showGroupPopup}>+</button>
                </div>
                <div class="blocks">
                    <Block></Block>
                </div>
            </div>
        </div>
    </div>
    <BlockPopup isShown={isBlockPopupShow} groupId={selectGroupId} on:close={closeBlockPopup}></BlockPopup>
    <GroupPopup on:complete={changeGroups} isShown={isGroupPopupShow} isCreate={isCreate} id={id} title={title} type={type} on:close={closeGroupPopup} />
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

    .groups {
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        gap: 5px;
        margin-top: 55px;
        overflow-x: auto;
        max-width: 100%;
        padding: 10px 0;
    }
    .groups::-webkit-scrollbar {
        width: 8px; 
        height: 8px;
    }
    .groups::-webkit-scrollbar-thumb {
        background-color: #2F81F7;
        border-radius: 4px; 
    }
    .groups::-webkit-scrollbar-track {
        background-color: #21262C;
        border-radius: 4px;
    }
    .groups {
        scrollbar-width: thin; 
        scrollbar-color: #2F81F7 #21262C; 
    }
    .group__item {
        min-width: 95px;
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
        padding: 0 10px;
        flex: 0 0 auto;
        transition: .2s;
    }
    .group__item:hover {
        background-color: #2F81F7;
        color: #fff;
    }
    .group__item + .group__item {
        margin-left: 5px;
    }
    /* .group__item.active {
        background-color: #2F81F7;
        color: #fff;
    } */
    .blocks {
        margin-top: 20px;
    }
</style>