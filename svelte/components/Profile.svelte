<script>
    function redirect(url) {
        location.href = url;
    }

    export let edit = true;
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
    {#if edit === true}
        <button class="profile__button" on:click={() => redirect('/edit-profile')}>프로필 편집</button>
    {:else}
        <button class="profile__button disabled" disabled >프로필 편집</button>
    {/if}
    <div class="profile__wrap">
        {#if edit === true}
            <button class="profile__wrap-text" on:click={() => redirect('/follow?type=follower')}>
                <div class="profile__text--white profile__text--bold">{user.followers}</div>
                <div class="profile__text">followers</div>
            </button>
            <button class="profile__wrap-text" on:click={() => redirect('/follow?type=following')}>
                <div class="profile__text--white profile__text--bold">{user.following}</div>
                <div class="profile__text">following</div>
            </button>
        {:else}
            <div class="profile__wrap-text">
                <div class="profile__text--white profile__text--bold">{user.followers}</div>
                <div class="profile__text">followers</div>
            </div>
            <div class="profile__wrap-text">
                <div class="profile__text--white profile__text--bold">{user.following}</div>
                <div class="profile__text">following</div>
            </div>
        {/if}
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
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
        min-height: 100%;
        object-fit: cover;
        object-position: center; 
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
    .profile__button.disabled {
        background-color: #777777;
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