<script>
    import { onMount, onDestroy } from 'svelte';
    import { userData } from '../utils/store.js';
    import { debounce } from '../utils/util.js';
    
    import Header from "../components/Header.svelte";
    import Profile from "../components/Profile.svelte";
    import MyPageMenu from "../components/MyPageMenu.svelte";
    import FollowCP from "../components/follow/FollowCP.svelte";

    import humanIcon from '../public/images/icons/human-icon-big.svg'
    import searchIcon from '../public/images/icons/search-icon.svg'

    const debouncedSearch = debounce(handleSearch, 300);
    let selectedFilter = 'follower';
    let searchUser = '';
    let userList = [];
    let user = {
        id: '',
        name: '',
        image: '',
        followers: 0,
        following: 0
    };

    async function getFollowers() {
        try {
            const res = await fetch('/api/users/followers');
            
            if (res.status === 200) {
                return res.json();
            } else {
                return [];
            }
        } catch (err) {
            return [];
        }      
    }

    async function getFollowings() {
        try {
            const res = await fetch('/api/users/followings');
            
            if (res.status === 200) {
                return res.json();
            } else {
                return [];
            }
        } catch (err) {
            return [];
        }      
    }

    function changeFollwings(event) {
        if (event.detail.isCreate) {
            userList = userList.map(following => following.user_id === event.detail.id ? { ...following, amIFollowing: 1 } : following);
        }

        if (event.detail.isDelete) {
            userList = userList.map(following => following.user_id === event.detail.id ? { ...following, amIFollowing: 0 } : following);
        }
    }

    async function handleFilter(key=null) {
        key = this?.value !== undefined ? this.value : key;

        if (key === 'following') {
            userList = await getFollowings();
        } else {
            userList = await getFollowers();
        }
    }

    async function handleSearch() {
        try {
            if (!searchUser) {
                handleFilter(selectedFilter);
            }
            
            const res = await fetch(`/api/users?search=${searchUser}`)
            if (res.status === 200) {
                userList = await res.json();
            } else {
                userList = [];
            }
        } catch (err) {
            userList = [];
            console.error(err);
        }
    }

    onMount(async () => {
        user = {
            id: $userData.id,
            name: $userData.name,
            image: $userData.image,
            followers: $userData.followerCount ?? 0,
            following: $userData.followingCount ?? 0
        };

        const queryParams = new URLSearchParams(location.search);
        const type = queryParams.get("type");
        selectedFilter = type ?? 'follower';
        handleFilter(selectedFilter);
    })
</script>

<div class="follow">
    <Header></Header>
    <div class="follow__contents">
        <div class="title">
            <div class="title__text--big"><img src="{humanIcon}" alt="human"> 팔로우 관리</div>
            <div class="title__text--small">개발자 노예로 살아가는 저의 페이지에 오신걸 환영합니다. 팔로우 해주세요:D Plz...</div>
        </div>
        <div class="follow__wrap">
            <div class="profile">
                <Profile user={user}></Profile>
                <MyPageMenu></MyPageMenu>
            </div>
            <div class="contents">
                <div class="contents__wrap">
                    <div class="search">
                        <img src="{searchIcon}" alt="search">
                        <input type="text" class="search__input" placeholder="아이디, 이름 검색" bind:value={searchUser} on:input={debouncedSearch}>
                    </div>
                    <div class="selector__wrap">
                        <label class="filter selector" for="filter">
                            <select name="filter" id="filter" class="selector__select" bind:value={selectedFilter} on:change={handleFilter}>
                                <option value="follower">팔로워</option>
                                <option value="following">팔로잉</option>
                            </select>
                        </label>
                        <label class="order selector" for="order">
                            <select name="order" id="order" class="selector__select">
                                <option value="">정렬 기준 기본</option>
                                <option value="newer">최신 순</option>
                                <option value="name">이름 순</option>
                            </select>
                        </label>
                    </div>
                </div>
                <div class="humans">
                    {#each userList as user} 
                        <FollowCP on:editFollow={changeFollwings} user={user}></FollowCP>
                    {/each}
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

    .selector__wrap {
        display: flex;
        flex-flow: row nowrap;
        gap: 10px;
    }
    .selector {
        background-color: #21262C;
        border-radius: 10px;
        display: flex;
        padding: 0 10px;
    }
    .selector__select {
        background-color: transparent;
        color: #fff;
        width: 100%;
        height: 44px;
        border-radius: 10px;
        padding: 5px 10px;
        border: none;
        outline: none;
    }
    .selector__select > option {
        background-color: #21262C;
        color: #fff;
        border: none;
        outline: none;
        padding: 5px 0;
    }
    .humans {
        margin-top: 20px;
        display: flex;
        flex-flow: column nowrap;
        gap: 10px;
    }
    
</style>