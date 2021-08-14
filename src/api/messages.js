import axios from '@/libs/api.request'

export const getMessageList = () => {
  return axios.request({
    url: '/admin/messages/list',
    method: 'get'
  })
}

export const addMessage = (message) => {
  return axios.request({
    data: message,
    url: '/admin/messages/add',
    method: 'post'
  })
}
