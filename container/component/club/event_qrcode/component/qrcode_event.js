import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
} from "react-native";
import {
  scale,
} from "container/variables/common";
import { getIntl } from "container/utils/common";
import QRCodeScanner from 'react-native-qrcode-scanner';
import { getRequest } from "container/utils/request";
import Config from "container/config/server.config";
import Avatar from "container/component/ui/avatar";
const { width } = Dimensions.get("window");
const intl = getIntl();

const QRCodeEvent = (props, ref) => {
  //props
  //state
  const [qrcode, setQRcode] = useState('');
  const [members, setMembers] = useState([]);

  //variables
  const { member: currMember } = global.organization || {};

  //hooks
  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  //functions -------------------------------------------------------------------------

  //render ----------------------------------------------------------------------------

  const onRead = data => {
    console.log('qrcodeeeeeeeeeeeee ', data)
    let mem_id = data && data.data || 'nothing';
    if (mem_id && mem_id.length == 24) {
      const res = getRequest('member/detail', {
        id: mem_id,
        type: 'simple'
      }).then((res) => {
        if (res && res.data) {
          let newMem = res.data;
          let oldMembers = members;
          console.log('getafterqrcodee: ', res, oldMembers);
          if (!oldMembers.find(x => x.id == newMem.id)) {
            oldMembers.push(newMem);
            setMembers([...oldMembers])
            console.log('qrcodeeeeeeeeeeeeemembers ', members)
          }
        }
      })
        .catch((err) => console.error(err));
    }
    else {
      setQRcode(mem_id);
    }
  }
  const renderListAttendanced = (members) => {
    return members.map((mem, index) => {
      return <View style={styles.mem_line}>
        <Avatar data={mem} noShadow />
        <Text style={{ color: 'green' }}>{mem.name || 'aaaaaaaaaaa'}</Text>
      </View>
    })
  }
  return (
    <View style={styles.container}>
      <View style={styles.scanner}>
        <QRCodeScanner
          onRead={onRead}
          // ref={(node) => { scanner = node }}
          reactivate={true}
          reactivateTimeout ={1000}
        />
      </View>
      {members && members.length ?
        renderListAttendanced(members)
        : <Text style={{ color: 'green' }}>{qrcode || 'aaaaaaaaaaaa'}</Text>}
    </View>
  );
};

export default forwardRef(QRCodeEvent);

const styles = StyleSheet.create({
  mem_line: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  scanner: {
    width: '100%',
    height: scale(500)
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
