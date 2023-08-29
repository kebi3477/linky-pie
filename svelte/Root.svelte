<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing/src/history";
    import Fetch from "./utils/fetch";
    
    async function isLogin() {
        const res = await Fetch.get('/api/users/me');
        return res.statusCode === 401 ? false : true;            
    }

    onMount(async () => {
        if (await isLogin()) {
            navigate("/my-page", { replace: true });
        } else {
            navigate("/intro", { replace: true });
        }
    })
</script>