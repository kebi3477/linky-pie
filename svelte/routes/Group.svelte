<script>
    import { onMount } from 'svelte';
    import { userData } from '../utils/store.js';

    import Header from "../components/Header.svelte";
    import Profile from "../components/Profile.svelte";
    import MyPageMenu from "../components/MyPageMenu.svelte";
    import GroupCp from "../components/group/GroupCP.svelte";
    import GroupPopup from "../components/group/GroupPopup.svelte";

    import folder from '../public/images/icons/folder-icon-big.svg';
    import plus from '../public/images/icons/plus-icon.svg';

    let isShow = false;
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

    function showCreateGroupPopup() {
        isCreate = true;
        id = '';
        title = '';
        type = '2';
        isShow = !isShow;
    }

    function showUpdateGroupPopup(event) {
        isCreate = false;
        id = event.detail.id;
        title = event.detail.title;
        type = event.detail.type.toString();
        isShow = true;
    }

    function changeGroups(event) {
        if (event.detail.isCreate) {
            groups = [event.detail, ...groups];
        }

        if (event.detail.isUpdate) {
            groups.forEach(group => {
                if (group.id === event.detail.id) {
                    group.title = event.detail.title;
                    group.type = event.detail.type;
                }
            });
            groups = groups;
        }

        if (event.detail.isDelete) {
            groups = groups.filter(group => group.id !== event.detail.id);
        }
    }
    
    async function getGroups() {
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

    onMount(async () => {
        user = {
            id: $userData.id,
            name: $userData.name,
            image: $userData.image,
            followers: $userData.followerCount ?? 0,
            following: $userData.followingCount ?? 0
        };
        groups = await getGroups();
    })
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
                <Profile user={user}></Profile>
                <MyPageMenu></MyPageMenu>
            </div>
            <div class="contents">
                <div class="group__header">
                    <button class="group__button" on:click={showCreateGroupPopup}>그룹 만들기 <img src="{plus}" alt="plus"></button>
                </div>
                <div class="group__list">
                    {#each groups as item}
                        <GroupCp group={item} on:editGroup={showUpdateGroupPopup} on:complete={changeGroups}></GroupCp>
                    {/each}
                </div>
            </div>
        </div>
    </div>
    <GroupPopup on:complete={changeGroups} isShown={isShow} isCreate={isCreate} id={id} title={title} type={type} on:close={() => isShow = false} />
</div>
<style>
    .group {
        width: 100%;
        min-height: 100vh;
        background-color: #0D1117;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
    }
    .group__contents {
        width: 1200px;
        padding: 100px 0;
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

    .group__header {
        width: 100%;
    }
    .group__button {
        width: 135px;
        height: 44px;
        color: #fff;
        border-radius: 10px;
        text-align: center;
        background-color: #2F81F7;
        font-size: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
    }
    .group__list {
        display: flex;
        flex-flow: column nowrap;
        gap: 5px;
        margin-top: 22px;
    }
</style>