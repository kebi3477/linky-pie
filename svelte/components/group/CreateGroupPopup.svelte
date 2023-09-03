<script>
    import { createEventDispatcher } from 'svelte';

    import closeCircle from '../../public/images/icons/close-circle-icon.svg';
    import closeIcon from '../../public/images/icons/close-icon.svg';

    const dispatch = createEventDispatcher();
    let title = '';

    function closePopup() {
        dispatch('close');
    }

    function emptyTitle() {
        title = '';
    }

    export let isShown = false;
</script>

<div class="popup" style="display: {isShown ? 'flex' : 'none'}">
    <div class="create-group">
        <button class="close__button" on:click={closePopup}>
            <img src="{closeIcon}" class="close__image" alt="close" >
        </button>
        <label for="title" class="title__wrap">
            <input type="text" id="title" class="title" placeholder="그룹명" bind:value={title}>
            <button class="empty-title" on:click={emptyTitle}>
                <img src="{closeCircle}" alt="closeCircle">
            </button>
        </label>
        <div class="create-group__text">그룹 공개 여부</div>
        <label for="option" class="option__wrap">
            <select name="option" id="option" class="option">
                <option value="1">전체 공개</option>
                <option value="0">비공개</option>
            </select>
        </label>
        <div class="create-group__wrap">
            <div class="create-group__button cancel">취소</div>
            <div class="create-group__button save">저장하기</div>
        </div>
    </div>
</div>


<style>
    .popup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(5px);
    }
    .create-group {
        width: 452px;
        height: 286px;
        background-color: #21262C;
        border-radius: 9px;
        display: flex;
        flex-flow: column nowrap;
        gap: 10px;
        padding: 44px 32px;
        position: relative;
    }
    .close__button {
        position: absolute;
        right: 22px;
        top: 22px;
        cursor: pointer;
    }
    .title__wrap {
        display: flex;
        flex-flow: row nowrap;
        gap: 10px;
        margin-top: 15px;
    }
    .title {
        font-size: 30px;
        font-weight: bold;
        height: 70px;
        width: 100%;
        background-color: transparent;
        outline: none;
        color: #fff;
        border-radius: 0px;
    }
    .title:focus {
        border-bottom: 1px solid #2F81F7;
    }
    .create-group__text {
        font-size: 15px;
        color: #999999;
        margin-top: 5px;
    }   
    .option__wrap {
        width: 190px;
        background-color: #1A1F25;
        border-radius: 9px;
        display: flex;
        flex-flow: nowrap;
    }
    #option {
        background-color: transparent;
        color: #fff;
        width: 100%;
        height: 44px;
        border-radius: 10px;
        padding: 5px 10px;
        border: none;
        outline: none;
    }
    #option > option {
        background-color: #1A1F25;
        color: #fff;
        border: none;
        outline: none;
        padding: 5px 0;
    }
    #option > option:hover {
        background-color: transparent;
        color: #2F81F7;
    }
    .create-group__wrap {
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: flex-end;
    }
    .create-group__button {
        width: 76px;
        height: 36px;
        color: #fff;
        font-size: 13px;
        border-radius: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .create-group__button.save {
        background-color: #2F81F7;
    }
</style>