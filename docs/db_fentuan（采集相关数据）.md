### db_fentuan（采集相关数据）

| table                                  | desc                                                       |
| -------------------------------------- | ---------------------------------------------------------- |
| ods_anchor_disc_i_tbl                  | 主播信息表                                                 |
| ods_gift_list_tbl                      | 礼物表，只包含douyu、panda、xypanda、longzhu、zhanqi、huya |
| ods_task_tbl                           | 调度任务表                                                 |
| ods_wb_anchor_start_time_info_tbl      | 开关播时间表                                               |
| ods_wb_anchor_start_time_info_tbl_tool | 直播工具开关播时间表                                       |
| ods_wb_categories_i_tbl                | 平台直播分类对应表                                         |
| ods_wb_platform_i_tbl                  | 采集平台维表                                               |
| ods_wb_type_i_tbl                      | 直播分类维表                                               |

### db_user（用户系统）

| table                    | desc |
| ------------------------ | ---- |
| all_room_bind            | 用户、工会绑定直播间维表 |
| back_tool_account        | 管理后台用户表 |
| back_tool_operation_info | 管理后台操作记录 |
| core_group_bind          | 分组绑定 |
| core_role_union_bind     | 工会绑定权限 |
| group                    | 分组表 |
| group_room_bind          | 房间-分组绑定 |
| invite_info              | 邀请信息 |
| operation_info           | 操作信息 |
| role_permission          | 权限信息 |
| union_info               | 公会信息 |
| union_room_bind          | 房间-工会绑定 |
| user_anchor              | 主播-用户绑定（丢弃） |
| user_platform            | 主播-平台绑定（面向直播宝工具） |
| user_room_bind           | 房间-用户绑定 |
| zhibobao_account         | 账户信息（手机号、微信、QQ、微博账户） |
| zhibobao_core            | 用户信息 |
| zhibobao_trace           | 用户三方信息绑定、解绑操作记录 |
|zhibobao_uid_index|uid 依据|

### db_rpt_fentuan（离线计算数据）

| table                                                | desc                        |
| ---------------------------------------------------- | --------------------------- |
| dwb_anchor_major_n_minor_cate                        | 主播主类目                  |
| rpt_anchor_chatmsg_amt_ranklist_(d日榜,m月榜,w周榜)  | 主播榜单_弹幕量排行榜       |
| rpt_anchor_gift_income_ranklist_(d日榜,m月榜,w周榜)  | 主播榜单_送礼价值排行榜     |
| rpt_dws_anchor_active_remain_rat_tbl_a_d             | 主播活跃留存数/率           |
| rpt_dws_anchor_char_remain_rat_tbl_a_d               | 主播弹幕留存数/率           |
| rpt_dws_anchor_info_explore_a_tbl_i_d                | 主播详细数据挖掘            |
| rpt_dws_anchor_info_time_distributed_a_tbl           | 主播人气表                  |
| rpt_dws_anchor_info_total_a_tbl_i_d_(五月内)         | 主播详细数据统计表，按天分  |
| rpt_dws_anchor_info_total_a_tbl_i_t_(五月内)         | 主播详细数据统计表，按时分  |
| rpt_dws_anchor_top_info_a_tbl_i_d                    | 主播近30天排行信息表        |
| rpt_dws_anchor_total_a_tbl_i_d                       | 主播数据统计表              |
| rpt_dws_anchor_user_top_tbl_d_(五月内)               | 主播用户排行榜              |
| rpt_dws_anthor_30d_top_a_tbl_i_d                     | 主播近30天排行信息表        |
| rpt_dws_anthor_live_a_tbl_s_d                        | 主播直播密度表???           |
| rpt_dws_anthor_live_time_a_tbl_s_d                   | 主播直播密度表???           |
| rpt_dws_tuhao_gift_preference_info_a_tbl             | 30礼物偏好                  |
| rpt_dws_tuhao_gift_preference_info_a_tbl_d           | 每天土豪礼物偏好            |
| rpt_dws_tuhao_gift_remain_tbl_d                      | 首次/流失用户送礼信息       |
| rpt_dws_tuhao_info_time_distributed_tbl              | 主播下土豪时段送礼详情      |
| rpt_dws_tuhao_user_info_distributed_tbl_d            | 土豪分布                    |
| rpt_dws_tuhao_user_info_tbl_30d                      |                             |
| rpt_dws_tuhao_user_info_tbl_d                        |                             |
| rpt_dws_union_anchor_data_a_tbl                      | 公会下主播当天数据          |
| rpt_dws_union_anchor_time_long_a_tbl_i_d             | 公会下主播直播有效时长表    |
| rpt_dws_union_group_anchor_total_a_tbl               | 公会分组数据统计            |
| rpt_dws_union_info_data_a_tbl                        | 公会当天数据                |
| rpt_dws_user_char_data_info_a_tbl_(五月内)           | 主播下用户当天弹幕详情      |
| rpt_dws_user_gift_data_info_a_tbl_(五月内)           | 主播下用户当天送礼详情      |
| rpt_dws_user_gift_preference_info_a_tbl_30d_(三月内) | 30礼物偏好                  |
| rpt_dws_user_gift_preference_info_a_tbl_d_(三月内)   | 每天礼物偏好                |
| rpt_dws_user_gift_remain_tbl_d_(四月内)              | 首次/流失用户送礼信息       |
| rpt_dws_user_gift_remain_total_tbl_d                 | 首次/流失用户送礼信息       |
| rpt_dws_user_info_time_distributed_30_tbl            | 30天时段信息详情            |
| rpt_dws_user_like_total_tbl_(三月内)                 | 用户画像统计表              |
| rpt_dws_user_portrail_total_tbl_(三月内)             | 用户画像统计表              |
| rpt_dws_user_top_info_a_tbl_i_d                      | 用户排行榜数据              |
| rpt_new_anchor_chatmsg_amt_ranklist_d                | 新晋主播榜单_弹幕量排行榜   |
| rpt_new_anchor_gift_income_ranklist_d                | 新晋主播榜单_送礼价值排行榜 |
| rpt_richer_outgo_ranklist_(d,m,w)                    |                             |
| wb_anchor_gift_info_a_tbl                            | 主播下当天送礼维表          |
### db_realtime_fentuan（实时计算数据）

| table                                               | desc                 |
| --------------------------------------------------- | -------------------- |
| abc_123                                             | 礼物信息表           |
| anchor_summary_info_tbl                             |                      |
| rpt_anchor_summary_char_info_tbl                    |                      |
| rpt_anchor_summary_people_info_tbl                  |                      |
| rpt_dws_anchor_info_tbl_d                           | 主播当天实时信息表   |
| rpt_dws_anchor_info_tbl_h                           | 主播当天实时信息表   |
| rpt_dws_anchor_online_info_tbl                      | 主播24小时开播信息表 |
| rpt_dws_anchor_start_info_tbl                       | 主播开关播信息表     |
| rpt_dws_anchor_summary_gift_info_tbl                |                      |
| rpt_dws_anchor_summary_gift_num_tbl                 |                      |
| rpt_dws_char_all\_(1, 24, 5)_top_tbl                | 平台分类弹幕排行     |
| rpt_dws_char_cate_all\_(1, 24, 5)_top_tbl           | 平台分类弹幕排行     |
| rpt_dws_char_cate_new\_(1, 24, 5)_top_tbl           | 平台分类弹幕排行     |
| rpt_dws_char_new\_(1, 24, 5)_top_tbl                | 平台分类弹幕排行     |
| rpt_dws_char_platform_all\_(1, 24, 5)_top_tbl       | 平台分类弹幕排行     |
| rpt_dws_char_platform_cate_all\_(1, 24, 5)_top_tbl  | 平台分类弹幕排行     |
| rpt_dws_char_platform_cate_new\_(1, 24, 5)_top_tbl  | 平台分类弹幕排行     |
| rpt_dws_char_platform_info_tbl                      | 弹幕信息表           |
| rpt_dws_char_platform_new\_(1, 24, 5)_top_tbl       | 平台分类弹幕排行                                                     |                      |
| rpt_dws_gift_all\_(1, 24, 5)_platform_cate_top_tbl  | 平台分类礼物排行榜   |
| rpt_dws_gift_all\_(1, 24, 5)_platform_top_tbl       | 平台分类礼物排行榜   |
| rpt_dws_gift_all\_(1, 24, 5)_top_tbl                | 平台分类礼物排行榜   |
| rpt_dws_gift_all\_(1, 24, 5)_cate_top_tbl           | 平台分类礼物排行榜   |
| rpt_dws_gift_new\_(1, 24, 5)_platform_cate_top_tbl  | 平台分类礼物排行榜   |
| rpt_dws_gift_new\_(1, 24, 5)_platform_top_tbl       | 平台分类礼物排行榜   |
| rpt_dws_gift_new\_(1, 24, 5)_top_tbl                | 平台分类礼物排行榜   |
| rpt_dws_gift_new\_(1, 24, 5)_cate_top_tbl           | 平台分类礼物排行榜   |
| rpt_dws_gift_platform_info_tbl                      | 礼物信息表           |
| rpt_dws_gift_user\_(1, 24, 5)_cate_top_tbl          | 平台分类礼物排行榜   |
| rpt_dws_gift_user\_(1, 24, 5)_platform_cate_top_tbl | 平台分类礼物排行榜   |
| rpt_dws_gift_user\_(1, 24, 5)_platform_top_tbl      | 平台分类礼物排行榜   |
| rpt_dws_gift_user\_(1, 24, 5)_top_tbl               | 平台分类礼物排行榜   |

