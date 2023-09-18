<script>
    import { createEventDispatcher } from 'svelte';

    import closeCircle from '../../public/images/icons/close-circle-icon.svg';
    import closeIcon from '../../public/images/icons/close-icon.svg';

    const dispatch = createEventDispatcher();

    function changeGroup(group) {
        dispatch('complete', group);
    }

    function closePopup() {
        id = '';
        title = '';
        type = '2';
        dispatch('close');
    }

    function emptyTitle() {
        title = '';
    }

    async function createGroup() {
        try {
            const data = {
                title, 
                type: +type
            }
            const res = await fetch('/api/groups', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            })
    
            if (res.status === 201) {
                const data = await res.json();
                data.isCreate = true;

                alert('그룹 생성 성공!');
                closePopup();
                changeGroup(data);
            } else {
                alert('그룹 생성 실패!');
            }
        } catch (err) {
            alert('그룹 생성 실패!');
            console.error(err);
        }
    }

    async function updateGroup() {
        try {
            const data = {
                title, 
                type: +type
            }
            const res = await fetch(`/api/groups/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            })
    
            if (res.status === 200) {
                const data = await res.json();
                data.isUpdate = true;

                alert('그룹 수정 성공!');
                closePopup();
                changeGroup(data);
            } else {
                alert('그룹 수정 실패!');
            }
        } catch (err) {
            alert('그룹 수정 실패!');
            console.error(err);
        }
    }

    export let id = '';
    export let title = '';
    export let type = "2";
    export let isShown = false;
    export let isCreate = false;
</script>

<div class="popup" style="display: {isShown ? 'flex' : 'none'};">
    <div class="create-group">
        <button class="close__button" on:click={closePopup}>
            <img src="{closeIcon}" class="close__image" alt="close" >
        </button>
        <label for="title" class="title__wrap">
            <input type="text" id="title" class="title" placeholder="그룹명" bind:value={title} maxlength="10">
            <button class="empty-title" on:click={emptyTitle}>
                <img src="{closeCircle}" alt="closeCircle">
            </button>
        </label>
        <div class="create-group__text">그룹 공개 여부</div>
        <label for="option" class="option__wrap">
            <select name="option" id="option" class="option" bind:value={type}>
                <option value=2>전체 공개</option>
                <option value=1>팔로워 공개</option>
                <option value=0>비공개</option>
            </select>
        </label>
        <div class="create-group__wrap">
            <button class="create-group__button cancel" on:click={closePopup}>취소</button>
            <button class="create-group__button save" on:click={isCreate ? createGroup() : updateGroup()}>저장하기</button>
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