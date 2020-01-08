<template>
  <div>
    <div class="audio_box">

      <div class="play">
        <el-popover placement="top" trigger="hover">
          <div style="text-align: center">
            <el-progress :percentage="music.volume" color="#67C23A" type="circle"/>
            <br>
            <el-button icon="el-icon-minus" circle @click="changeVolume(-10)"/>
            <el-button icon="el-icon-plus" circle @click="changeVolume(10)"/>

          </div>
          <el-button id="play" slot="reference" :icon="music.isPlay?'el-icon-video-pause':'el-icon-caret-right'" circle @click="play"/>
        </el-popover>
      </div>

      <div class="sliders">
        <el-slider v-model="music.currentTime" :max="music.maxTime" :show-tooltip="false" @change="changeTime"/>
        <audio ref="musicPlay" autoplay="autoplay">
          <source :src="musicUrl" type="audio/mpeg">
        </audio>
      </div>

      <div class="time">
        <span class="startTime">{{ cTime }}</span> / <span class="endTime">{{ dTime }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['musicUrl', 'autoplay'],
  data() {
    return {
      music: {
        isPlay: false,
        currentTime: 0,
        maxTime: 0,
        volume: 100
      },
      dTime: '00:00',
      cTime: '00:00'
    }
  },
  mounted() {
    const music = this.$refs.musicPlay // 音频所在对象
    music.addEventListener('canplay', () => {
      const musicTime = music.duration // 获得音频时长
      this.music.maxTime = musicTime
      const branch = Math.floor(musicTime / 60) // 计算音频分钟
      const second = Math.ceil(musicTime % 60) // 计算音频秒
      if (branch < 10 && second < 10) { // 四种情况判断音频总时间
        this.dTime = `0${branch}:0${second}`
      } else if (branch < 10) {
        this.dTime = `0${branch}:${second}`
      } else if (second < 10) {
        this.dTime = `${branch}:0${second}`
      } else {
        this.dTime = `${branch}:${second}`
      }
    })
    // 获得音频正在播放时的处理
    music.addEventListener('timeupdate', () => {
      // eslint-disable-next-line no-unused-vars
      const musicTime = music.duration // 获得音频时长
      const stopTime = music.currentTime // 获得已播放的音频时长
      this.music.currentTime = stopTime
      const branch = Math.floor(stopTime / 60) // 计算已播放的音频分钟
      const second = Math.floor(stopTime % 60) // 计算已播放的音频秒
      if (branch < 10 && second < 10) { // 四种情况判断显示音频以播放时间
        this.cTime = `0${branch}:0${second}`
      } else if (branch < 10) {
        this.cTime = `0${branch}:${second}`
      } else if (second < 10) {
        this.cTime = `${branch}:0${second}`
      } else {
        this.cTime = `${branch}:${second}`
      }
    })
    music.addEventListener('pause',
      () => { // 监听暂停
        this.music.isPlay = false
        // 解决浮点数不播放时常不精准的BUG
        const musicTime = music.duration // 获得音频时长
        const stopTime = music.currentTime // 获得已播放的音频时长
        if (musicTime - stopTime <= 1) {
          this.cTime = this.dTime
        }
      }, false)
  },
  methods: {
    play() {
      // 获取所有audios
      var audios = document.getElementsByTagName('audio')
      // 暂停函数
      function pauseAll() {
        var self = this;
        [].forEach.call(audios, function(i) {
          // 将audios中其他的audio全部暂停
          i !== self && i.pause()
        })
      }
      // 给play事件绑定暂停函数
      [].forEach.call(audios, function(i) {
        i.addEventListener('play', pauseAll.bind(i))
      })
      if (this.$refs.musicPlay.paused) {
        this.$refs.musicPlay.play()
      } else {
        this.$refs.musicPlay.pause()
      }

      this.music.isPlay = !this.$refs.musicPlay.paused
    },
    changeTime(time) {
      this.$refs.musicPlay.currentTime = time
      const audio = this.$refs.musicPlay
      audio.currentTime = time
    },
    changeVolume(v) {
      this.music.volume += v
      if (this.music.volume > 100) {
        this.music.volume = 100
      }
      if (this.music.volume < 0) {
        this.music.volume = 0
      }
      this.$refs.musicPlay.volume = this.music.volume / 100
    }
  }
}
</script>

<style scoped>
.audio_box {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.play {
  flex: 2;
  display: flex;
  justify-content: center;
}
.sliders {
  flex: 5;
  margin: 0 5px;
}
.time {
  flex: 3;
  color:#409eff
}
</style>
