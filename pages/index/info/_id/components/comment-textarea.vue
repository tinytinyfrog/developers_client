<template>
  <div class="library-comment-textarea g-bm-border">
    <Comment>
      <div slot="content">
        <FormItem>
          <div v-auth="{}">
            <Textarea ref="textArea" v-model="commentValue" :rows="2" />
          </div>
        </FormItem>
        <FormItem>
          <Alert v-if="errorMsg" :message="errorMsg" banner />
          <div style="text-align: right;">
            <Button v-auth="{ handler: handleSubmit }" html-type="submit" :loading="loading" type="primary">
              提交评论
            </Button>
          </div>
        </FormItem>
      </div>
    </Comment>
  </div>
</template>

<script>
import { Comment, Input, Button, Form, Alert } from 'ant-design-vue'
const FormItem = Form.Item
const Textarea = Input.TextArea
export default {
  name: 'LibraryCommentTextarea',
  components: {
    Comment,
    Textarea,
    Button,
    FormItem,
    Alert
  },
  props: {
    reloadCommentList: {
      type: Function,
      default: () => {}
    },
    article: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      loading: false,
      errorMsg: '',
      commentValue: ''
    }
  },
  watch: {
    $route (to) {
      if (to.hash === '#article-comment') {
        setTimeout(() => {
          this.$refs.textArea.focus()
        }, 100)
      }
    }
  },
  methods: {
    handleSubmit () {
      if (this.loading) return
      if (!this.commentValue) {
        this.errorMsg = '评论内容不能为空哦~'
        return
      }
      this.errorMsg = ''
      this.loading = true
      this.$api.createCommentByArticle({
        postsId: this.article.id,
        content: this.commentValue,
        replyId: ''
      }).then((res) => {
        this.loading = false
        if (res.message === 'success') {
          this.commentValue = ''
          this.$message.success({
            duration: 2,
            content: '评论成功~'
          })
          if (typeof this.reloadCommentList === 'function') { this.reloadCommentList() }
          return
        }
        this.$message.error({
          duration: 2,
          content: res.message
        })
      }).catch(() => {
        this.commentValue = ''
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .library-comment-textarea {
    padding: 0 @g-padding * 2;
    /deep/.ant-comment-inner {
      padding-bottom: 0;
    }
  }
 /deep/.ant-comment-avatar {
   margin: 0;
 }
</style>
