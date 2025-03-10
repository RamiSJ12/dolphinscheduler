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
import { useI18n } from 'vue-i18n'
import type { IJsonItem } from '../types'

export function useEmr(model: { [field: string]: any }): IJsonItem[] {
  const { t } = useI18n()

  return [
    {
      type: 'editor',
      field: 'jobFlowDefineJson',
      name: t('project.node.emr_flow_define_json'),
      props: {
        language: 'json'
      },
      validate: {
        trigger: ['input', 'trigger'],
        required: true,
        message: t('project.node.emr_flow_define_json_tips')
      }
    },
    {
      type: 'custom-parameters',
      field: 'localParams',
      name: t('project.node.custom_parameters'),
      children: [
        {
          type: 'input',
          field: 'prop',
          span: 6,
          props: {
            placeholder: t('project.node.prop_tips'),
            maxLength: 256
          },
          validate: {
            trigger: ['input', 'blur'],
            required: true,
            validator(validate: any, value: string) {
              if (!value) {
                return new Error(t('project.node.prop_tips'))
              }

              const sameItems = model.localParams.filter(
                (item: { prop: string }) => item.prop === value
              )

              if (sameItems.length > 1) {
                return new Error(t('project.node.prop_repeat'))
              }
            }
          }
        },
        {
          type: 'select',
          field: 'direct',
          span: 4,
          options: DIRECT_LIST,
          value: 'IN'
        },
        {
          type: 'select',
          field: 'type',
          span: 6,
          options: TYPE_LIST,
          value: 'VARCHAR'
        },
        {
          type: 'input',
          field: 'value',
          span: 6,
          props: {
            placeholder: t('project.node.value_tips'),
            maxLength: 256
          }
        }
      ]
    }
  ]
}

export const TYPE_LIST = [
  {
    value: 'VARCHAR',
    label: 'VARCHAR'
  },
  {
    value: 'INTEGER',
    label: 'INTEGER'
  },
  {
    value: 'LONG',
    label: 'LONG'
  },
  {
    value: 'FLOAT',
    label: 'FLOAT'
  },
  {
    value: 'DOUBLE',
    label: 'DOUBLE'
  },
  {
    value: 'DATE',
    label: 'DATE'
  },
  {
    value: 'TIME',
    label: 'TIME'
  },
  {
    value: 'TIMESTAMP',
    label: 'TIMESTAMP'
  },
  {
    value: 'BOOLEAN',
    label: 'BOOLEAN'
  }
]

export const DIRECT_LIST = [
  {
    value: 'IN',
    label: 'IN'
  },
  {
    value: 'OUT',
    label: 'OUT'
  }
]
