<script>
    import { navigate } from "svelte-routing/src/history";

    function redirect(url) {
        navigate(`${url}`, { replace: true });
    }

    export let user = {
        id: '',
        name: '',
        image: '',
        followers: 0,
        following: 0
    };
 </script>

<div class="profile">
    <div class="profile__image">
        <img src="{user.image}" alt="{user.name}">
    </div>
    <div class="profile__text--white profile__text--big title">{user.name}</div>
    <div class="profile__text profile__text--small email">{user.id}</div>
    <div class="profile__button">프로필 편집</div>
    <div class="profile__wrap">
        <button class="profile__wrap-text" on:click={() => redirect('/follow?type=follower')}>
            <div class="profile__text--white profile__text--bold">{user.followers}</div>
            <div class="profile__text">followers</div>
        </button>
        <button class="profile__wrap-text" on:click={() => redirect('/follow?type=following')}>
            <div class="profile__text--white profile__text--bold">{user.following}</div>
            <div class="profile__text">following</div>
        </button>
    </div>
</div>

<style>
    .profile {
        width: 280px;
        height: 385px;
        background-color: #21262C;
        border-radius: 10px;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: center;
        padding: 18px;
    }
    .profile__image {
        width: 116px;
        height: 116px;
        border-radius: 100%;
        border: 1px solid #939393;
        background-color: #fff;
        overflow: hidden;
    }
    .profile__image > img {
        width: 100%;
        height: 100%;
    }
    .profile__text {
        color: #777777;
    }
    .profile__text--white {
        color: #fff;
    }
    .profile__text--bold {
        font-weight: bold;
    }
    .profile__text--big {
        font-size: 20px;
        font-family: 'Ramche', sans-serif;
    }
    .profile__text--small {
        font-size: 11px;
    }
    .profile__button {
        background-color: #2F81F7;
        width: 100%;
        text-align: center;
        color: #fff;
        font-size: 14px;
        border-radius: 7px;
        padding: 10px;
        cursor: pointer;
        margin: 30px 0;
    }

    .profile__wrap {
        display: flex;
        flex-flow: row nowrap;
        gap: 7px;
    }
    .profile__wrap-text {
        display: flex;
        flex-flow: row nowrap;
        color: #fff;
        gap: 3px;
        font-size: 13px;
        cursor: pointer;
    }

    .title {
        margin-top: 30px;
    }
    .email {
        margin-top: 15px;
    }

</style>