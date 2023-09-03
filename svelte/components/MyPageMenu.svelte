<script>
    import { navigate } from "svelte-routing/src/history";
    import follow from '../public/images/icons/human-icon.svg';
    import group from '../public/images/icons/folder-icon.svg';
    import series from '../public/images/icons/alpha-icon.svg';
    import stack from '../public/images/icons/calendar-icon.svg';

    function redirect(url) {
        navigate(`/${url}`, { replace: true });
    }
</script>

<div class="menu">
    <button class="menu__item" on:click={() => redirect('follow')}>
        <div class="menu__img">
            <img src="{follow}" alt="follow">
        </div>
        <div class="menu__text">팔로우 관리</div>
    </button>
    <button class="menu__item" on:click={() => redirect('group')}>
        <div class="menu__img">
            <img src="{group}" alt="group">
        </div>
        <div class="menu__text">그룹 관리</div>
    </button>
    <div class="menu__item">
        <div class="menu__img">
            <img src="{series}" alt="series">
        </div>
        <div class="menu__text">시리즈 관리</div>
    </div>
    <div class="menu__item">
        <div class="menu__img">
            <img src="{stack}" alt="stack">
        </div>
        <div class="menu__text">스택 관리</div>
    </div>
</div>

<style>
    .menu {
        width: 100%;
        padding: 30px 20px;
        display: flex;
        flex-flow: column nowrap;
        gap: 15px;
    }
    .menu__item {
        display: flex;
        flex-flow: row nowrap;
        gap: 20px;
        cursor: pointer;
        transition: .5s;
        align-items: center;
    }
    .menu__item:hover > .menu__text {
        text-decoration: underline;
    }
    .menu__img {
        width: 17px;
        height: 17px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .menu__img > img {
        width: 100%;
    }
    .menu__text {
        color: #fff;
        font-size: 13px;
        font-weight: bold;
    }
</style>