<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-warning">
              <i class="nc-icon nc-chart text-warning"></i>
            </div>
            <div slot="content">
              <p class="card-category"></p>
              <h4 class="card-title"></h4>
            </div>
            <div slot="footer">
              <i class="fa fa-refresh"></i>Actuel
            </div>
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-success">
              <i class="nc-icon nc-circle-09 text-success"></i>
            </div>
            <div slot="content">
              <p class="card-category"></p>
              <h4 class="card-title"></h4>
            </div>
            <div slot="footer">
              <i class="fa fa-calendar-o"></i>Actuel
            </div>
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-danger">
              <i class="nc-icon nc-circle-09 text-danger"></i>
            </div>
            <div slot="content">
              <p class="card-category"></p>
              
              <h4 class="card-title"></h4>
            </div>
            <div slot="footer">
              <i class="fa fa-clock-o"></i>Actuel
            </div>
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-info">
              <i class="nc-icon nc-backpack text-primary"></i>
            </div>
            <div slot="content">
              <p class="card-category"></p>
              <h4 class="card-title"></h4>
            </div>
            <div slot="footer">
              <i class="fa fa-refresh"></i>Actuel
            </div>
          </stats-card>
        </div>

      </div>
     
      </div>

     
    </div>
  </div>
</template>
<script>
  import ChartCard from 'src/components/UIComponents/Cards/ChartCard.vue'
  import StatsCard from 'src/components/UIComponents/Cards/StatsCard.vue'
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import LTable from 'src/components/UIComponents/Table.vue'
  import monstore from 'src/store/Monstore';
  import Checkbox from 'src/components/UIComponents/Inputs/Checkbox.vue'

  export default {
    components: {
      Checkbox,
      Card,
      LTable,
      ChartCard,
      StatsCard,
    },
    mounted(){
     
    },
    
    data () {
      return {
      
        state:monstore.state,
    
        editTooltip: 'Edit Task',
        deleteTooltip: 'Remove',
        pieChart: {
          data: {
            labels: ['40%', '20%', '40%'],
            series: [40, 20, 40]
          }
        },
        barChart: {
          data: {
            labels: [],
            series: [[]]
          },
          options: {
            seriesBarDistance: 10,
            backgroundColor: '#f87979',
            axisX: {
              showGrid: true
            },
            height: '245px'
          },
          responsiveOptions: [
            ['screen and (max-width: 640px)', {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc (value) {
                  return value[0]
                }
              }
            }]
          ]
        },
        barChart1: {
          data: {
            labels: [],
            series: [[]]
          },
          options: {
            seriesBarDistance: 10,
            backgroundColor: '#f87979',
            axisX: {
              showGrid: true
            },
            height: '245px'
          },
          responsiveOptions: [
            ['screen and (max-width: 640px)', {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc (value) {
                  return value[0]
                }
              }
            }]
          ]
        },
      }
    }
  }
</script>
<style>

</style>
