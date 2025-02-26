/**
 * hisotry/bookmark/setting modal
 */

import { Component } from '../common/react-subx'
import _ from 'lodash'
import { Modal, Tabs, Col, Row } from 'antd'
import TerminalThemeForm from '../terminal-theme'
import TerminalThemeList from '../terminal-theme/theme-list'
import QuickCommandsList from '../quick-commands/quick-commands-list'
import QuickCommandsForm from '../quick-commands/quick-commands-form'
import BookmarkForm from '../bookmark-form'
import List from './list'
import TreeList from './tree-list'
import Setting from './setting'
import SyncSetting from '../setting-sync/setting-sync'
import { settingMap } from '../../common/constants'
import copy from 'json-deep-copy'

const { prefix } = window
const e = prefix('setting')
const m = prefix('common')
const c = prefix('control')
const t = prefix('terminalThemes')
const q = prefix('quickCommands')
const { TabPane } = Tabs

export default class SettingModal extends Component {
  render () {
    const { store } = this.props
    const selectItem = (item) => {
      store.modifier({ settingItem: item })
    }

    const tabsShouldConfirmDel = [
      settingMap.bookmarks,
      settingMap.terminalThemes
    ]

    const renderTabs = () => {
      const { tab, settingItem, list } = store
      const props0 = {
        store,
        activeItemId: settingItem.id,
        type: tab,
        onClickItem: selectItem,
        shouldComfirmDel: tabsShouldConfirmDel.includes(tab),
        list
      }
      const formProps = {
        store,
        formData: settingItem,
        type: tab,
        hide: store.hideModal,
        ..._.pick(store, [
          'currentBookmarkGroupId',
          'config'
        ]),
        bookmarkGroups: copy(store.bookmarkGroups),
        bookmarks: copy(store.bookmarks)
      }
      return (
        <Tabs
          activeKey={tab}
          animated={false}
          onChange={store.onChangeTab}
        >
          <TabPane
            tab={m(settingMap.history)}
            key={settingMap.history}
          >
            <Row>
              <Col span={6}>
                <List
                  {...props0}
                />
              </Col>
              <Col span={18}>
                {
                  settingItem.id
                    ? (
                      <BookmarkForm
                        key={settingItem.id}
                        {...formProps}
                      />
                    )
                    : <div className='form-wrap pd2 aligncenter'>{c('notFoundContent')}</div>
                }

              </Col>
            </Row>
          </TabPane>
          <TabPane
            tab={m(settingMap.bookmarks)}
            key={settingMap.bookmarks}
          >
            <Row>
              <Col span={10}>
                <TreeList
                  {...props0}
                  {..._.pick(store, [
                    'bookmarkGroups',
                    'currentBookmarkGroupId',
                    'bookmarks',
                    'autofocustrigger',
                    'config'
                  ])}
                />
              </Col>
              <Col span={14}>
                <BookmarkForm
                  key={settingItem.id}
                  {...formProps}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane
            tab={m(settingMap.setting)}
            key={settingMap.setting}
          >
            <Row>
              <Col span={6}>
                <List
                  {...props0}
                />
              </Col>
              <Col span={18}>
                {
                  settingItem.id
                    ? (
                      <SyncSetting
                        store={store}
                        formData={copy(store.config.syncSetting)}
                        {..._.pick(store, [
                          'autofocustrigger',
                          'isSyncingSetting',
                          'isSyncDownload',
                          'isSyncUpload'
                        ])}
                      />
                    )
                    : <Setting {...props0} config={store.config} />
                }
              </Col>
            </Row>
          </TabPane>
          <TabPane
            tab={t(settingMap.terminalThemes)}
            key={settingMap.terminalThemes}
          >
            <Row>
              <Col span={6}>
                <TerminalThemeList
                  {...props0}
                  theme={store.config.theme}
                />
              </Col>
              <Col span={18}>
                <TerminalThemeForm {...formProps} key={settingItem.id} />
              </Col>
            </Row>
          </TabPane>
          <TabPane
            tab={q(settingMap.quickCommands)}
            key={settingMap.quickCommands}
          >
            <Row>
              <Col span={6}>
                <QuickCommandsList
                  {...props0}
                  quickCommandId={store.quickCommandId}
                />
              </Col>
              <Col span={18}>
                <QuickCommandsForm
                  {...formProps}
                  key={settingItem.id}
                />
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      )
    }

    return (
      <Modal
        {...{
          title: e('settings'),
          onCancel: store.hideModal,
          footer: null,
          width: '94%',
          height: '94%',
          visible: store.showModal
        }}
      >
        {renderTabs()}
      </Modal>
    )
  }
}
