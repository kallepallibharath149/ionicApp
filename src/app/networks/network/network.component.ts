import { Component, OnInit, ViewChild } from '@angular/core';
// import { ActionSheetController, LoadingController, ToastController } from '@ionic/angular';

import { ApiService } from './../../common/api.service.service';
import { RelationGraphDataService } from './../../common/relation-graph-data.service';
import { RelationGraphComponent } from './relation-graph/relation-graph.component';

declare var Neo4jd3;

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss'],
})
export class NetworkComponent implements OnInit {

  neo4jd3: any;
  options: any;
  selectedNode: any = {};
  loading: any;
  toaster: any;
  constructor(private relationGraphDataService: RelationGraphDataService,
    private apiService: ApiService,
    // public loadingController: LoadingController,
    // public toastController: ToastController,
    // public actionSheetController: ActionSheetController
    ) { }
  @ViewChild(RelationGraphComponent, { static: false }) relationGraph: RelationGraphComponent;
  async ngOnInit() {
    // this.loading = await this.loadingController.create({
    //   message: 'Please wait...',
    // });
    // this.toaster = await this.toastController.create({
    //   message: '2 Nodes added successfully',
    //   duration: 3000
    // });
    this.prepareTheRelationshipTree();
  }

  async prepareTheRelationshipTree() {
    // this.loading = await this.loadingController.create({
    //   message: 'Please wait...',
    // });
    // this.loading.present();
    this.apiService.getNodes().subscribe((response) => {

      const dataObj = this.addDummyRelations(response);
      this.options = {
        highlight: [
          {
            class: 'Project',
            property: 'name',
            value: 'neo4jd3'
          }, {
            class: 'User',
            property: 'userId',
            value: 'eisman'
          }
        ],

        images: [
          "http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_spiderman.png",
          "http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_captainmarvel.png",
          "http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_hulk.png",
          "http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_blackwidow.png",
          "http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_daredevil.png",
          "http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_wolverine.png",
          "http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_captainamerica.png",
          "http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_ironman.png",
          "http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_thor.png",
          "http://marvel-force-chart.surge.sh/marvel_force_chart_img/drdoom.png",
          "http://marvel-force-chart.surge.sh/marvel_force_chart_img/mystique.png",
          "http://marvel-force-chart.surge.sh/marvel_force_chart_img/redskull.png",
          "http://marvel-force-chart.surge.sh/marvel_force_chart_img/ronan.png",
          "http://marvel-force-chart.surge.sh/marvel_force_chart_img/magneto.png",
          "http://marvel-force-chart.surge.sh/marvel_force_chart_img/thanos.png",
          "http://marvel-force-chart.surge.sh/marvel_force_chart_img/blackcat.png",
          "http://marvel-force-chart.surge.sh/marvel_force_chart_img/avengers.png",
          "http://marvel-force-chart.surge.sh/marvel_force_chart_img/gofgalaxy.png",
          "http://marvel-force-chart.surge.sh/marvel_force_chart_img/defenders.png",
          "http://marvel-force-chart.surge.sh/marvel_force_chart_img/xmen.png",
          "http://marvel-force-chart.surge.sh/marvel_force_chart_img/fantasticfour.png",
          "http://marvel-force-chart.surge.sh/marvel_force_chart_img/inhumans.png"
        ],
        neo4jData: dataObj,
        nodeRadius: 19,
        zoomFit: false,
        infoPanel: false
      };
      // this.loading.dismiss();
    }, err => {
      // this.loading.dismiss();
    });
  }

  addDummyRelations(response) {
    const newRelations = [];
    const relations = response.relationships;
    for (let i = 0; i < relations.length; i++) {
      const relation = JSON.parse(JSON.stringify(relations[i]));
      newRelations.push(relations[i])
      relation.id = i;
      const endNode = relation.endNode;
      relation.endNode = relation.startNode;
      relation.startNode = endNode;
      relation.isReverseRelation = true;
      newRelations.push(relation);
    }
    response.relationships = newRelations;
    return response;
  }

  rNodeDblClickHandler(node) {
    this.selectedNode = node;
    this.presentActionSheet();
  }

  relationshipDoubleClickHandler(relationship) {
    console.log('double click on relationship: ', relationship);
  }
  OnNodeClick(node) {
    const maxNodes = 5;
    // this.loading.present();
    this.apiService.getNodes(node.nodeID).subscribe(data => {
      this.relationGraph.updateWithNeo4jData(data, node);
      // this.loading.dismiss();
    }, err => {
      console.log(err);
      // this.loading.dismiss();
    })
  }

  async presentActionSheet() {
    // const actionSheet = await this.actionSheetController.create({
    //   buttons: [{
    //     text: 'Add',
    //     role: 'destructive',
    //     handler: () => {
    //       this.addNodes();
    //     }
    //   },
    //   {
    //     text: 'Cancel',
    //     role: 'cancel',
    //   }]
    // });
    // await actionSheet.present();
  }

  addNodes() {
    // this.loading.present();
    const payload = {
      parent_id: this.selectedNode.id,
      count: 2
    };
    this.apiService.addNodes(payload).subscribe(data => {
      // this.loading.dismiss();
      // this.toaster.present();
    }, err => {
      // this.loading.dismiss();
    });
  }
  selectNode(node) {
    // this.relationGraph.selectNode(node);
  }
  refresh() {
    this.options = null;
    this.prepareTheRelationshipTree();
  }

}
