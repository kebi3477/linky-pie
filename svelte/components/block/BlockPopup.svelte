<script>
    import { createEventDispatcher } from 'svelte';

    import closeIcon from '../../public/images/icons/close-icon.svg';
    import closeCircle from '../../public/images/icons/close-circle-icon.svg';

    const dispatch = createEventDispatcher();
    let link = '';

    const closePopup = () => {
        dispatch('close');
    }

    const emptyLink = () => {
        link = '';
    }

    const createBlock = async () => {
        try {
            const data = {
                link
            }
            const res = await fetch(`/api/blocks?group_id=${groupId}`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            })
    
            if (res.status === 201) {
                const data = await res.json();
                data.isCreate = true;

                alert('링크 생성 성공!');
                location.reload();
                closePopup();
            } else {
                alert('링크 생성 실패!');
            }
        } catch (err) {
            alert('링크 생성 실패!');
            console.error(err);
        }
    }

    export let groupId = '';
    export let isShown = false;
</script>

<div class="popup" style="display: {isShown ? 'flex' : 'none'};">
    <div class="create-block">
        <div class="popup__header">
            <div class="header__text">링크 등록</div>
            <button class="close__button" on:click={closePopup}>
                <img src="{closeIcon}" class="close__image" alt="close" >
            </button>
        </div>
        <label for="link" class="link__wrap">
            <input type="text" id="link" class="link" placeholder="링크" bind:value={link} maxlength="200">
            <button class="empty-link" on:click={emptyLink}>
                <img src="{closeCircle}" alt="closeCircle">
            </button>
        </label>
        <div class="create-block__wrap">
            <button class="create-block__button cancel" on:click={closePopup}>취소</button>
            <button class="create-block__button save" on:click={createBlock}>추가하기</button>
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
    .create-block {
        width: 452px;
        background-color: #21262C;
        border-radius: 9px;
        display: flex;
        flex-flow: column nowrap;
        gap: 10px;
        position: relative;
    }
    .popup__header {
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        border-bottom: .25px solid #fff;
        padding: 15px 25px;
    }
    .header__text {
        font-size: 20px;
        font-weight: bold;
        color: #fff;
    }
    .close__button {
        width: 45px;
        height: 45px;
        margin-right: -10px;
        cursor: pointer;
    }
    .link__wrap {
        display: flex;
        flex-flow: row nowrap;
        gap: 10px;
        padding: 20px;
    }
    .link {
        font-size: 15px;
        font-weight: bold;
        height: 30px;
        width: 100%;
        background-color: transparent;
        outline: none;
        color: #fff;
        border-radius: 0px;
    }
    .link:focus {
        border-bottom: 1px solid #2F81F7;
    }

    .create-block__wrap {
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: flex-end;
        padding: 20px;
    }
    .create-block__button {
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
    .create-block__button.save {
        background-color: #2F81F7;
    }
</style>