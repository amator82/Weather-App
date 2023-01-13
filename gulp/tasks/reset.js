import { deleteAsync } from "del"

async function reset() {
    await deleteAsync(app.path.clean)
}
export {reset}