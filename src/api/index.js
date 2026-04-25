import { post, get, patch, remove } from './client'
import URLS from './urls.json'

export const auth = {
  login: (data) => post(URLS.auth.login, data, { skipAuthRedirect: true }),
  register: bind(post, URLS.register.createUser),
}

export const user = {
  getCurrent: () => get(URLS.user.getCurrentUser, {}, { skipAuthRedirect: true }),
  getAll: bind(get, URLS.user.getAllUser),
  search: bind(get, URLS.user.getSearchUser),
  patchUser: (userId, data) => patch(URLS.user.patchUser.replace('{user_id}', userId), data),
}

export const patient = {
  getAllPatient: bind(get, URLS.patient.getAllPatient),
  getSearchPatient: bind(get, URLS.patient.getSearchPatient),
  getPatientById: bind(get, URLS.patient.getPatientById),
  createPatient: bind(post, URLS.patient.postCreatePatient),
  patchPatient: (patientId, data) => patch(URLS.patient.patchPatient.replace('{patient_id}', patientId), data),
  deletePatient: bind(remove, URLS.patient.deletePatient),
}

export const recipe = {
  getAllRecipe: bind(get, URLS.recipe.getAllRecipe),
  getRecipeById: (recipeId) => get(URLS.recipe.getRecipeById.replace('{recipe_id}', recipeId)),
  postSearchRecipe: (body, query) => {
    const qs = query && Object.keys(query).length
      ? '?' + new URLSearchParams(query).toString()
      : ''
    return post(URLS.recipe.postSearchRecipe + qs, body)
  },
  patchRecipe: (recipeId, data) => patch(URLS.recipe.patchRecipe.replace('{recipe_id}', recipeId), data),
  createRecipe: bind(post, URLS.recipe.postCreateRecipe),
  deleteRecipe: (recipeId) => remove(URLS.recipe.deleteRecipe.replace('{recipe_id}', recipeId)),
}

export const substance = {
  getAllSubstance: bind(get, URLS.substance.getAllSubstance),
  getSearchSubstance: bind(get, URLS.substance.getSearchSubstance),
  patchSubstance: (substanceId, data) => patch(URLS.substance.patchSubstance.replace('{substance_id}', substanceId), data),
  createSubstance: bind(post, URLS.substance.postCreateSubstance),
}

export const warehouse = {
  getAllWarehouse: bind(get, URLS.warehouse.getAllWarehouse),
  getSearchWarehouse: bind(get, URLS.warehouse.getSearchWarehouse),
  getWarehouseById: bind(get, URLS.warehouse.getWarehouseById),
  patchWarehouse: (warehouseId, data) => patch(URLS.warehouse.patchWarehouse.replace('{pack_id}', warehouseId), data),
  createWarehouse: bind(post, URLS.warehouse.postCreateWarehouse),
}

export const solvent = {
  getAllSolvent: bind(get, URLS.solvent.getAllSolvent),
  getSearchSolvent: bind(get, URLS.solvent.getSearchSolvent),
}

export const task = {
  getAllTask: bind(get, URLS.task.getAllTask),
  getTaskById: (taskId) => get(URLS.task.getTaskById.replace('{task_id}', taskId)),
  postSearchTask: (body, query) => {
    const qs = query && Object.keys(query).length
      ? '?' + new URLSearchParams(query).toString()
      : ''
    return post(URLS.task.postSearchTask + qs, body)
  },
  postCreateTask: bind(post, URLS.task.postCreateTask),
  patchTask: (taskId, data) => patch(URLS.task.patchTask.replace('{task_id}', taskId), data),
  deleteTask: (taskId) => remove(URLS.task.deleteTask.replace('{task_id}', taskId)),
  addRecipeToTask: (taskId, data) => post(URLS.task.postAddRecipeToTask.replace('{task_id}', taskId), data),
  addActiveSubstancePackToTask: (taskId, data) => post(URLS.task.postAddActiveSubstancePackToTask.replace('{task_id}', taskId), data),
  addMessageToTask: (taskId, data) => post(URLS.task.postAddMessageToTask.replace('{task_id}', taskId), data),
}

function bind(f, arg) {
  return (...args) => f(arg, ...args)
}
