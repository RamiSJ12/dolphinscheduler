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

import { defineComponent, onMounted, toRefs, watch } from 'vue'
import {
  NButton,
  NCard,
  NDataTable,
  NIcon,
  NInput,
  NPagination
} from 'naive-ui'
import { SearchOutlined } from '@vicons/antd'
import { useI18n } from 'vue-i18n'
import { useTable } from './use-table'
import Card from '@/components/card'
import AlarmGroupModal from './components/alarm-group-modal'
import styles from './index.module.scss'

const alarmGroupManage = defineComponent({
  name: 'alarm-group-manage',
  setup() {
    const { t } = useI18n()
    const { variables, getTableData, createColumns } = useTable()

    const requestData = () => {
      getTableData({
        pageSize: variables.pageSize,
        pageNo: variables.page,
        searchVal: variables.searchVal
      })
    }

    const onUpdatePageSize = () => {
      variables.page = 1
      requestData()
    }

    const onSearch = () => {
      variables.page = 1
      requestData()
    }

    const handleModalChange = () => {
      variables.showModalRef = true
      variables.statusRef = 0
    }

    const onCancelModal = () => {
      variables.showModalRef = false
    }

    const onConfirmModal = () => {
      variables.showModalRef = false
      requestData()
    }

    onMounted(() => {
      createColumns(variables)
      requestData()
    })

    watch(useI18n().locale, () => {
      createColumns(variables)
    })

    return {
      t,
      ...toRefs(variables),
      requestData,
      onCancelModal,
      onConfirmModal,
      onUpdatePageSize,
      handleModalChange,
      onSearch
    }
  },
  render() {
    const {
      t,
      requestData,
      onUpdatePageSize,
      onCancelModal,
      onConfirmModal,
      handleModalChange,
      onSearch,
      loadingRef
    } = this

    return (
      <div>
        <NCard>
          <div class={styles['search-card']}>
            <div>
              <NButton size='small' type='primary' onClick={handleModalChange}>
                {t('security.alarm_group.create_alarm_group')}
              </NButton>
            </div>
            <div class={styles.box}>
              <NInput
                size='small'
                clearable
                v-model={[this.searchVal, 'value']}
                placeholder={t('security.alarm_group.search_tips')}
              />
              <NButton size='small' type='primary' onClick={onSearch}>
                {{
                  icon: () => (
                    <NIcon>
                      <SearchOutlined />
                    </NIcon>
                  )
                }}
              </NButton>
            </div>
          </div>
        </NCard>
        <Card class={styles['table-card']}>
          <NDataTable loading={loadingRef} columns={this.columns} data={this.tableData} />
          <div class={styles.pagination}>
            <NPagination
              v-model:page={this.page}
              v-model:page-size={this.pageSize}
              page-count={this.totalPage}
              show-size-picker
              page-sizes={[10, 30, 50]}
              show-quick-jumper
              onUpdatePage={requestData}
              onUpdatePageSize={onUpdatePageSize}
            />
          </div>
        </Card>
        <AlarmGroupModal
          showModalRef={this.showModalRef}
          statusRef={this.statusRef}
          row={this.row}
          onCancelModal={onCancelModal}
          onConfirmModal={onConfirmModal}
        />
      </div>
    )
  }
})

export default alarmGroupManage
