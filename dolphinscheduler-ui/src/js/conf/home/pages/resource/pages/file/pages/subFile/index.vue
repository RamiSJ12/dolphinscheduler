/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
<template>
  <m-list-construction :title="$t('Create File')">
    <template slot="content">
      <div class="resource-create-model">
        <m-list-box-f>
          <template slot="name"><strong>*</strong>{{$t('File Name')}}</template>
          <template slot="content">
            <el-input
                    type="input"
                    v-model="fileName"
                    maxlength="60"
                    style="width: 300px;"
                    size="small"
                    :placeholder="$t('Please enter name')">
            </el-input>
          </template>
        </m-list-box-f>
        <m-list-box-f>
          <template slot="name"><strong>*</strong>{{$t('File Format')}}</template>
          <template slot="content">
            <el-select v-model="suffix" size="small" style="width: 100px;" @change="_onChange">
              <el-option
                      v-for="city in fileTypeList"
                      :key="city"
                      :value="city"
                      :label="city">
              </el-option>
            </el-select>
          </template>
        </m-list-box-f>
        <m-list-box-f>
          <template slot="name">{{$t('Description')}}</template>
          <template slot="content">
            <el-input
                    type="textarea"
                    v-model="description"
                    style="width: 430px;"
                    size="small"
                    :placeholder="$t('Please enter description')"
                    autocomplete="off">
            </el-input>
          </template>
        </m-list-box-f>
        <m-list-box-f>
          <template slot="name"><strong>*</strong>{{$t('File Content')}}</template>
          <template slot="content">
            <textarea id="code-create-mirror" name="code-create-mirror"></textarea>
          </template>
        </m-list-box-f>
        <m-list-box-f>
          <template slot="name">&nbsp;</template>
          <template slot="content">
            <div class="submit">
              <el-button type="primary" size="mini" round :loading="spinnerLoading" @click="ok()">{{spinnerLoading ? $t('Loading...') : $t('Create')}} </el-button>
              <el-button type="text" size="mini" @click="() => $router.push({name: 'file'})"> {{$t('Cancel')}} </el-button>
            </div>
          </template>
        </m-list-box-f>
      </div>
    </template>
  </m-list-construction>
</template>
<script>
  import i18n from '@/module/i18n'
  import { mapActions } from 'vuex'
  import { filtTypeArr } from '../_source/common'
  import { handlerSuffix } from '../details/_source/utils'
  import codemirror from '../_source/codemirror'
  import mListBoxF from '@/module/components/listBoxF/listBoxF'
  import localStore from '@/module/util/localStorage'
  import mListConstruction from '@/module/components/listConstruction/listConstruction'

  let editor
  export default {
    name: 'resource-list-create-FILE',
    data () {
      return {
        suffix: 'sh',
        fileName: '',
        description: '',
        fileTypeList: filtTypeArr,
        content: '',
        pid: -1,
        currentDir: '/',
        spinnerLoading: false
      }
    },
    props: {},
    methods: {
      ...mapActions('resource', ['createResourceFile']),
      ok () {
        if (this._validation()) {
          this.spinnerLoading = true
          this.createResourceFile({
            type: 'FILE',
            pid: this.$route.params.id,
            currentDir: localStore.getItem('currentDir'),
            fileName: this.fileName,
            suffix: this.suffix,
            description: this.description,
            content: editor.getValue()
          }).then(res => {
            this.$message.success(res.msg)
            setTimeout(() => {
              this.spinnerLoading = false
              this.$router.push({ path: `/resource/file/subdirectory/${this.$route.params.id}` })
            }, 800)
          }).catch(e => {
            this.$message.error(e.msg || '')
            this.spinnerLoading = false
          })
        }
      },
      _validation () {
        if (!this.fileName) {
          this.$message.warning(`${i18n.$t('Please enter resource name')}`)
          return false
        }
        if (!editor.getValue()) {
          this.$message.warning(`${i18n.$t('Please enter the resource content')}`)
          return false
        }
        if (editor.doc.size > 3000) {
          this.$message.warning(`${i18n.$t('Resource content cannot exceed 3000 lines')}`)
          return false
        }

        return true
      },
      /**
       * Processing code highlighting
       */
      _handlerEditor () {
        // editor
        editor = codemirror('code-create-mirror', {
          mode: 'shell',
          readOnly: false
        })

        this.keypress = () => {
          if (!editor.getOption('readOnly')) {
            editor.showHint({
              completeSingle: false,
              extraKeys: {
                Enter: ''
              }
            })
          }
        }

        // Monitor keyboard
        editor.on('keypress', this.keypress)
      },
      _onChange (val) {
        editor.setOption('mode', handlerSuffix['.' + val.label])
      }
    },
    watch: {},
    created () {
    },
    mounted () {
      this._handlerEditor()
    },
    destroyed () {
      editor.toTextArea() // uninstall
      editor.off($('.code-create-mirror'), 'keypress', this.keypress)
    },
    computed: {},
    components: { mListConstruction, mListBoxF }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .resource-create-model {
    padding: 30px;
  }
  .CodeMirror {
    border:1px solid #DDDEDD;
    border-radius: 3px;
  }
</style>
