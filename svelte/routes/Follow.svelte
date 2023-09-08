<script>
    import { onMount } from 'svelte';
    import { userData } from '../utils/store.js';
    import { debounce } from '../utils/util.js';
    
    import Header from "../components/Header.svelte";
    import Profile from "../components/Profile.svelte";
    import MyPageMenu from "../components/MyPageMenu.svelte";
    import FollowCP from "../components/follow/FollowCP.svelte";

    import human from '../public/images/icons/human-icon-big.svg'
    import search from '../public/images/icons/search-icon.svg'

    const debouncedSearch = debounce(handleSearch, 300);
    let searchUser = '';
    let followers = [];
    let followings = [];
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
            followings = followings.map(following => following.user_id === event.detail.id ? { ...following, amIFollowing: 1 } : following);
        }

        if (event.detail.isDelete) {
            followings = followings.map(following => following.user_id === event.detail.id ? { ...following, amIFollowing: 0 } : following);
        }
    }

    async function handleSearch() {
        try {
            const res = await fetch(`/api/users?id=${searchUser}`)

            if (res.status === 200) {
                followings = await res.json();
            } else {
                followings = [];
            }
        } catch (err) {
            followings = [];
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
        followers = await getFollowers();
        followings = await getFollowings();
    })
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
                <Profile user={user}></Profile>
                <MyPageMenu></MyPageMenu>
            </div>
            <div class="contents">
                <div class="contents__wrap">
                    <div class="search">
                        <img src="{search}" alt="search">
                        <input type="text" class="search__input" placeholder="아이디 검색" bind:value={searchUser} on:input={debouncedSearch}>
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
                    {#each followings as following} 
                        <FollowCP on:editFollow={changeFollwings} user={following}></FollowCP>
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
    .order {
        width: 190px;
        background-color: #21262C;
        border-radius: 10px;
        display: flex;
    }
    #order {
        background-color: transparent;
        color: #fff;
        width: 100%;
        height: 44px;
        border-radius: 10px;
        padding: 5px 10px;
        border: none;
        outline: none;
    }
    #order > option {
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