<script>
    import { createEventDispatcher } from 'svelte';

    import dots from '../../public/images/icons/dots-icon.svg'
    import defaultImage from '../../public/images/default-image.svg'

    const dispatch = createEventDispatcher();

    async function handleFollow(user) {
        if (user.amIFollowing === 1) {
            try {
                const res = await fetch(`/api/users/follow/${user.user_id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                })
        
                if (res.status === 200) {
                    const data = await res.json();
                    data.isDelete = true;

                    changeFollow(data);
                }
            } catch (err) {
                alert('언팔로잉 실패!');
                console.error(err);
            }
        } else if (user.amIFollowing === 0 || user.amIFollowing === null) {
            try {
                const res = await fetch(`/api/users/follow/${user.user_id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                })
        
                if (res.status === 201) {
                    const data = await res.json();
                    data.isCreate = true;

                    changeFollow(data);
                }
            } catch (err) {
                alert('팔로잉 실패!');
                console.error(err);
            }
        }
    }

    function changeFollow(follow) {
        dispatch('editFollow', follow);
    }

    export let user = {
        user_id: '',
        user_name: '',
        user_image: '',
        user_type: 0,
        user_provider: 0,
        user_created_at: '',
        user_updated_at: '',
        user_deleted_at: '',
        amIFollowing: 0
    };
</script>

<div class="human">
    <div class="human__image">
        <img src="{user.user_image ? user.user_image : defaultImage}" alt="user_image" />
    </div>
    <div class="human__name">{user.user_name}</div>
    <button class="human__button {user.amIFollowing ? 'following' : 'follow'}" on:click={() => handleFollow(user)}>{user.amIFollowing ? '팔로잉' : '팔로우'}</button>
    <div class="human__menu-button">
        <img src="{dots}" alt="menu_button">
    </div>
</div>

<style>
    .human {
        width: 100%;
        padding: 15px 30px;
        background-color: #21262C;
        border-radius: 10px;
        display: grid;
        grid-template-columns: 55px 1fr auto 20px;
        align-items: center;
        gap: 20px;
    }
    .human__image {
        width: 60px;
        height: 60px;
        border-radius: 100%;
        overflow: hidden;
    }
    .human__image > img {
        width: 100%;
        height: 100%;
    }
    .human__name {
        font-size: 15px;
        color: #fff;
    }
    .human__button {
        padding: 5px 30px;
        background-color: #58616F;
        border-radius: 7px;
        color: #fff;
        font-size: 14px;
        cursor: pointer;
    }
    .human__button.follow {
        background-color: #2F81F7;
    }
    .human__menu-button {
        cursor: pointer;
    }
</style>