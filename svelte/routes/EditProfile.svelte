<script>
    import { onMount } from 'svelte';
    import { userData } from '../utils/store.js';

    import Header from "../components/Header.svelte";
    import Profile from "../components/Profile.svelte";
    import MyPageMenu from "../components/MyPageMenu.svelte";

    import humanIcon from '../public/images/icons/human-icon-big.svg'
  
    let profileName = ''; 
    let profileImage; 
    let user = {
        id: '',
        name: '',
        image: '',
        followers: 0,
        following: 0
    };

    async function updateName() {
        try {
            const body = { name: profileName }
            const res = await fetch("/api/users/name", {
                method: "PATCH",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json", },
            });
            
            if (res.status === 200) {
                const data = await res.json();

                alert("이름이 성공적으로 변경되었습니다.");
                user.name = data.name;
            } else {
                alert("이름 변경에 실패하였습니다.");
            }
        } catch (error) {
            alert("이름 변경에 실패하였습니다.");
            console.log(error);
        }
    }

    async function updateProfileImage() {
        try {
            const formData = new FormData();
            formData.append("profileImage", profileImage);
            formData.append("userId", user.id);

            const res = await fetch("/api/users/image", {
                method: "PATCH",
                body: formData,
            });

            if (res.status === 200) {
                const data = await res.json();

                alert("프로필 이미지가 성공적으로 변경되었습니다.");
                user.image = data.image;
            } else {
                alert("프로필 이미지 변경에 실패하였습니다.");
            }
        } catch (error) {
            alert("서버에 연결할 수 없습니다.");
            console.log(error);
        }
    }

    function handleImageChange(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) { // 이미지 파일인지 확인
            profileImage = file;
        } else {
            profileImage = null;
            alert('유효한 이미지 파일을 선택해주세요.');
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
        profileName = user.name;
    })
  </script>

<div class="profile">
    <Header></Header>
    <div class="profile__contents">
        <div class="title">
            <div class="title__text--big"><img src="{humanIcon}" alt="human"> 프로필 수정</div>
            <div class="title__text--small">프로필 수정 해주세용</div>
        </div>
        <div class="profile__wrap">
            <div class="profile">
                <Profile user={user}></Profile>
                <MyPageMenu></MyPageMenu>
            </div>
            
            <div class="contents">
                <div class="profile-edit">
                    <div class="profile-edit__wrap">
                        <label for="name">이름:</label>
                        <input id="name" type="text" bind:value={profileName} maxlength="20"/>
                        <button on:click={updateName}>이름 수정</button>
                    </div>
                    <div class="profile-edit__wrap">
                        <label for="profile--image">프로필 사진:</label>
                        <input id="profile--image" type="file" on:change={handleImageChange} />
                        <button on:click={updateProfileImage}>프로필 이미지 수정</button>
                        {#if profileImage}
                            <div class="image-preview__wrap">
                                <div class="image-preview">
                                    <img src={URL.createObjectURL(profileImage)} alt="Preview" />
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .profile {
        width: 100%;
        min-height: 100vh;
        background-color: #0D1117;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
    }
    .profile__contents {
        width: 1200px;
        padding-top: 100px;
    }
    .profile__wrap {
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

    .profile-edit {
        background-color: #1D232B;
        padding: 25px 40px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        margin: 0 auto;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        gap: 30px;
    }
    .profile-edit__wrap {
        width: 100%;
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }
    .profile-edit label {
        display: block;
        margin-bottom: 8px;
        color: #AEAEAE;
        font-size: 14px;
        font-weight: 600;
    }
    .profile-edit input[type="text"],
    .profile-edit input[type="file"] {
        padding: 12px;
        border: 1px solid #333740;
        border-radius: 8px;
        background-color: #2C343D;
        color: #fff;
        outline: none;
        transition: border-color 0.3s, box-shadow 0.3s;
        flex: 1;
    }
    .profile-edit input[type="text"]:focus,
    .profile-edit input[type="file"]:focus {
        border-color: #007BFF;
        box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
    }
    .profile-edit input[type="file"] {
        padding: 6px;
        cursor: pointer;
    }
    .profile-edit img {
        display: block;
        margin-top: 12px;
        margin-bottom: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .profile-edit button {
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        background-color: #007BFF;
        color: #fff;
        cursor: pointer;
        font-weight: 600;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
    }
    .profile-edit button:hover {
        background-color: #0056b3;
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    }
    .image-preview__wrap {
        width: 100%;
    }
    .image-preview {
        display: flex;
        justify-content: center; 
        align-items: center;
        overflow: hidden;
        width: 116px;
        height: 116px;
        border-radius: 100%;
        border: 1px solid #939393;
        background-color: #fff;
    }
    .image-preview > img {
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
        min-height: 100%;
        object-fit: cover;
        object-position: center; 
    }
</style>
  