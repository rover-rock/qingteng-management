<template>
  <div>
    <Row :gutter="20">
      <Col span="8">
        <div>
          <Card
            v-for="(item, index) in messages"
            :key="index"
            @click.native="edit(item.id)"
            style="margin-bottom:10px;"
          >
            <p>{{ item.title }}</p>
            <p>{{ item.time }}</p>
          </Card>
        </div>
      </Col>
      <Col span="16">
      <Input v-model="title" placeholder="输入标题" style="width: 35vw;margin-bottom:20px;">
        <span slot="prepend">标题</span>
      </Input>
        <editor ref="editor" :value="content" @on-change="handleChange" />
        <div>
          <Button @click="submit">提交</Button>
          <Button @click="newMessage">新建系统消息</Button>
        </div>

      </Col>
    </Row>
  </div>
</template>

<script>
import Editor from '_c/editor'
import { getMessageList, addMessage } from '@/api/messages'

export default {
  name: 'editor_page',
  components: {
    Editor
  },
  data () {
    return {
      content: '请单击左侧选择消息',
      messages: [],
      message_id: null,
      title: ''
    }
  },
  mounted () {
    getMessageList().then(res => {
      this.messages = res.data
    })
  },
  methods: {
    handleChange (html, text) {
      this.content = html
    },
    submit () {
      addMessage({
        id: this.message_id,
        content: this.content,
        time: (new Date()).toLocaleString(),
        title: this.title
      }).then(res => {
        getMessageList().then(res => {
          this.messages = res.data
        })
      })
    },
    edit (message_id) {
      const message = this.messages.filter(m => m.id === message_id)[0]
      this.content = message.content
      this.title = message.title
      this.message_id = message_id
    },
    newMessage () {
      this.content = '此处编写新消息...'
      this.title = '此处编写新标题'
      this.message_id = null
    }
  }
}
</script>

<style></style>
