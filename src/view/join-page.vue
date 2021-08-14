<template>
  <div>
    <Row :gutter="20">
            <Col span="8">
              <div>
                <Card
                  v-for="(item, index) in feedbacks"
                  :key="index"
                  @click.native="show_feedback(index)"
                  style="margin-bottom:10px;cursor:pointer;"
                >
                  <p>{{ decodeURIComponent(item.content[0].text) }}</p>
                  <p>用户{{item.user}}发布于 {{item.content[0].time}}</p>
                </Card>
              </div>
            </Col>
            <Col span="16">
              <div class="message-detail-panel">
                <div v-if="feedback_index === null">提交新的反馈</div>
                <div v-else>
                  <Card v-for="(item, index) in feedbacks[feedback_index].content" :key="index" style="margin-bottom:10px;cursor:pointer;">
                   <p style="margin-bottom:5px;">{{ decodeURIComponent(item.text)}}</p>
                    <p>{{item.source === 'user' ? '用户' : '管理员'}}&emsp;发布于&emsp;{{item.time}}</p>
                  </Card>
                </div>
                <textarea class="text-area" v-model="text"></textarea>
                <Button type="primary" @click="submit">提交</Button>
              </div>
            </Col>
          </Row>
  </div>
</template>

<script>
import { get_feedback_list, add_feedback } from '@/api/user'
export default {
  name: 'join_page',
  data () {
    return {
      feedbacks: [],
      feedback_index: null,
      text: ''
    }
  },
  mounted () {
    get_feedback_list().then(res => {
      this.feedbacks = res.data.map(row => {
        row.content = JSON.parse(row.content)
        return row
      })
    })
  },
  methods: {
    show_feedback (index) {
      this.feedback_index = index
    },
    submit () {
      const newContent = { text: encodeURIComponent(this.text), time: (new Date()).toLocaleString(), source: 'admin' }, content = ''
      if (this.feedback_index !== null) {
        let oldContent = this.feedbacks[this.feedback_index].content
        oldContent.push(newContent)
        content = JSON.stringify(oldContent)
      } else {
        content = JSON.stringify([newContent])
      }
      let id = this.feedback_index === null ? undefined : this.feedbacks[this.feedback_index].id
      add_feedback({ content, id })
        .then(get_feedback_list)
        .then(res => {
          this.feedbacks = res.data.map(row => {
            row.content = JSON.parse(row.content)

            return row
          })
        })
    }
  }
}
</script>
<style>
  .message-detail-panel{
  background: white;
    padding: 20px;
}
.text-area{
  width: 100%;
    border-radius: 2px;
    outline: none;
    border: 1px solid #f2f2f2;
    padding: 5px;
}
</style>
